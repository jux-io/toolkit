import { Node, SourceFile, SyntaxKind } from 'ts-morph';
import memoizee from 'memoizee';
import { ImportDescriptor } from './get-imports-from-file.ts';
import { colorScheme, logger } from '../utils';
import { evaluateObject } from './evaluate-object.ts';
import { BEFORE_PARENT, stringifyCssObject, TokensManager } from '../tokens';
import { transformDesignTokenValueToCss } from '../tokens/transform-design-token-value-to-css.ts';
import { getAliasMatches } from '@juxio/design-tokens';
import crypto from 'node:crypto';
import { walkObject } from '../utils';
import { Tokens } from '../config';
import cssbeautify from 'cssbeautify';
import path from 'path';

export interface FileParserOptions {
  sourceFile: SourceFile;
  imports: ImportDescriptor[];
  cwd?: string;
  // In order to check if a function is a JUX function, we need to know the module / path it's imported from
  juxImportsPath: string[];
}

const JUX_CSS_FUNCTIONS = new Set<string>(['css']);

export const enum JUX_FUNCTIONS {
  STYLED = 'styled',
  CSS = 'css',
}

export interface ParsedJsxFunctionResult {
  type: 'function';
  kind: JUX_FUNCTIONS.STYLED;
  /**
   * The key is the function parameter key, the value is the object or array of objects passed to this key
   * ```
   * jux.styled('button', {
   *   root: {
   *         ^^^ => object
   *   ^^^ => key
   *     backgroundColor: '{core.color.brand_200}',
   *   },
   *   variants: [
   *     {
   *       props: { hello: 'hey' },
   *       style: {
   *         color: 'red',
   *       },
   *     },
   *   ],
   * })
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
}

/**
 * The result of parsing a CSS function
 * ```
 * css({ color: 'red' })
 * ```
 */
export interface ParsedCSSFunctionResult {
  type: 'function';
  kind: JUX_FUNCTIONS.CSS;
  props: object;
}

export type ParsedResult = ParsedJsxFunctionResult | ParsedCSSFunctionResult;

export type ParsedFileStructure = Map<string, ParsedResult>;

export class FileParser {
  /**
   * List of imports in the file, filtered to contain only jux imports
   * @description See import parser {@link getImportsFromFile}
   * @private
   */
  private readonly imports: ImportDescriptor[] = [];

  /**
   * Map of namespaces in the file and their import descriptor
   * ```
   * import * as jux from "@juxio/react-styled";
   *             ^^^
   * ```
   * @private
   */
  private readonly namespaces = new Map<string, ImportDescriptor>();

  /**
   * List of Jux CSS functions in the file
   * ```
   * import { css } from "@juxio/react-styled";
   *          ^^^
   * ```
   * ```
   * import { css as juxCss } from "@juxio/react-styled";
   *                 ^^^
   * ```
   * @private
   */
  private readonly cssImports = new Set<string>();

  /**
   * List of JSX functions in the file
   * ```
   * import { styled } from "@juxio/react-styled";
   * ```
   * @private
   */
  private readonly jsxFunctionsAlias = new Set<string>();

  /**
   * A map of JUX functions and their parsed results
   */
  private readonly parsedFileStructure = new Map<string, ParsedResult>();

  constructor(private options: FileParserOptions) {
    this.imports = options.imports;

    const isJuxCssImport = this.createMemoizedMatchFunction(
      this.options.juxImportsPath,
      Array.from(JUX_CSS_FUNCTIONS)
    );

    this.imports.forEach((importDescriptor) => {
      if (importDescriptor.kind === 'namespace') {
        this.namespaces.set(importDescriptor.alias, importDescriptor);
      }

      if (isJuxCssImport(importDescriptor.alias)) {
        this.cssImports.add(importDescriptor.alias);
      }

      // TODO: Find a better place to save 'styled' alias
      if (importDescriptor.name === JUX_FUNCTIONS.STYLED) {
        this.jsxFunctionsAlias.add(importDescriptor.alias);
      }
    });
  }

  createMemoizedMatchFunction(modules: string[], keys: string[]) {
    const matchingImports = this.imports.filter(
      (o) =>
        modules.some((m) => o.module.includes(m)) &&
        (o.kind === 'namespace' || keys.includes(o.name))
    );

    return memoizee((alias: string): boolean => {
      return !!matchingImports.find((importResult) => {
        if (importResult.kind === 'namespace') {
          return keys.includes(alias.replace(importResult.alias, ''));
        }

        return importResult.alias === alias || importResult.name === alias;
      });
    });
  }

  isJsxFunction = memoizee((functionName: string): boolean => {
    for (const alias of this.jsxFunctionsAlias) {
      if (functionName.startsWith(alias)) return true;
    }

    const [namespace, identifier] = functionName.split('.');

    const ns = this.namespaces.get(namespace);
    return ns
      ? this.options.juxImportsPath.some((m) => ns.module.includes(m)) &&
          identifier === JUX_FUNCTIONS.STYLED
      : false;
  });

  isJuxFunction = memoizee((functionName: string): boolean => {
    return (
      this.isJsxFunction(functionName) || this.cssImports.has(functionName)
    );
  });

  /**
   * Returns parsed information from the current file. Keys are the function / component name, values are the style object given to this
   * function or component
   */
  parseAst(): ParsedFileStructure {
    // Parse the AST of the source file
    const callExpressions = this.options.sourceFile.getDescendantsOfKind(
      SyntaxKind.CallExpression
    );

    callExpressions.forEach((callExpression) => {
      // Get the actual function name
      const expression = callExpression.getExpression();
      const functionName = expression.getText();

      if (!this.isJuxFunction(functionName)) {
        return;
      }

      logger.debug(
        `Parsing Jux function: ${colorScheme.debug(functionName)} at ${colorScheme.verbose(
          path.relative(
            this.options.cwd ?? process.cwd(),
            this.options.sourceFile.getFilePath()
          )
        )}`
      );

      const fnArguments = callExpression.getArguments();

      fnArguments.forEach((arg) => {
        if (Node.isObjectLiteralExpression(arg)) {
          this.parsedFileStructure.set(functionName, {
            type: 'function',
            kind: this.cssImports.has(functionName)
              ? JUX_FUNCTIONS.CSS
              : JUX_FUNCTIONS.STYLED,
            props: evaluateObject(arg, this.options.sourceFile),
          });
        }
      });
    });

    return this.parsedFileStructure;
  }

  /**
   * Parses the styles given to css / styled function
   */
  parseStyleObject(
    tokensManager: TokensManager,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    baseStyles: Record<string, any>,
    functionName: string
  ) {
    // We're creating classes for each composite tokens, so collect all composite tokens by category
    const compositeTokens = tokensManager.getCompositeTokensByCategory();

    return walkObject(baseStyles, (key, value) => {
      if (compositeTokens.has(key as keyof Tokens)) {
        const { valuePath } = getAliasMatches(value);
        if (!valuePath) {
          logger.warn(
            `Token value ${colorScheme.input(key)}: "${colorScheme.input(value)}" is not a valid design token path in ${colorScheme.debug(functionName)} function`
          );
          // if valuePath cannot be found, it means it does not contain any design token (required for composite tokens)
          return { type: 'remove' };
        }

        const compositeToken = compositeTokens
          .get(key as keyof Tokens)!
          .filter((t) => t.finalizedTokenName === valuePath);

        if (compositeToken.length === 0) {
          // User used non-existing composite token
          logger.warn(
            `Token value ${colorScheme.input(key)}: "${colorScheme.input(value)}" was not found in ${colorScheme.debug(functionName)} function`
          );
          return { type: 'remove' };
        }

        return {
          type: 'merge_with_parent',
          value:
            compositeToken.length > 1
              ? compositeToken
                  .map((t) => ({
                    [`${BEFORE_PARENT}[data-jux-theme="${t.themeName}"]`]:
                      t.cssVarValue,
                  }))
                  .reduce((acc, val) => ({ ...acc, ...val }), {})
              : compositeToken[0].cssVarValue,
        };
      }

      // This is not a composite token, so we need to transform the value to CSS
      // Check if the value contains an alias token path, and check if it exist so we can give warning to user
      if (typeof value === 'string') {
        const { valuePath } = getAliasMatches(value);
        if (valuePath) {
          if (
            !Array.from(tokensManager.tokensMap.values()).find(
              (t) => t.finalizedTokenName === valuePath
            )
          ) {
            logger.warn(
              `Token value ${colorScheme.input(key)}: "${colorScheme.input(value)}" was not found in ${colorScheme.debug(functionName)} function`
            );
          }
        }
      }

      return {
        type: 'replace',
        value: transformDesignTokenValueToCss(value),
      };
    });
  }

  generateParsedFilesStyles(tokensManager: TokensManager): string {
    const results: string[] = [];

    const parsedFile = this.parseAst();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cssObject: Record<string, any> = {};
    let baseClassHash = '';

    console.log(parsedFile);

    Array.from(parsedFile.entries()).forEach(([functionName, parsedResult]) => {
      switch (parsedResult.kind) {
        case JUX_FUNCTIONS.STYLED:
          baseClassHash = `jux-${crypto
            .createHash('sha256')
            .update(JSON.stringify(parsedResult.props.root))
            .digest('hex')
            .slice(0, 6)}`;

          // Parse and push 'root' styles
          cssObject = {
            [`.${baseClassHash}`]: this.parseStyleObject(
              tokensManager,
              parsedResult.props.root,
              functionName
            ),
          };

          // Parse and push any variants styles
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parsedResult.props.variants?.forEach((v: any) => {
            const subClassHash = `jux-${crypto
              .createHash('sha256')
              .update(JSON.stringify(v.style))
              .digest('hex')
              .slice(0, 6)}`;

            cssObject[`.${baseClassHash}`] = {
              ...cssObject[`.${baseClassHash}`],
              [`&.${subClassHash}`]: this.parseStyleObject(
                tokensManager,
                v.style,
                functionName
              ),
            };
          });

          results.push(cssbeautify(stringifyCssObject(cssObject)));
          break;
        case JUX_FUNCTIONS.CSS:
          baseClassHash = `jux-${crypto
            .createHash('sha256')
            .update(JSON.stringify(parsedResult.props))
            .digest('hex')
            .slice(0, 6)}`;

          // Parse and push 'root' styles
          cssObject = {
            [`.${baseClassHash}`]: this.parseStyleObject(
              tokensManager,
              parsedResult.props,
              functionName
            ),
          };

          results.push(cssbeautify(stringifyCssObject(cssObject)));
          break;
      }
    });
    console.log('done');
    return results.join('\n\n');
  }
}
