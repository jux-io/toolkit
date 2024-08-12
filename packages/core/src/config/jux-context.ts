import { type LoadConfigRes } from './load-config';
import bluebird from 'bluebird';
import { JuxAPI } from '../api';
import { type Asset } from '../assets';
import { type JuxCLIConfig, type Themes } from './config.types';
import { Config } from '@oclif/core';
import path from 'path';
import { FileManager } from '../fs';
import { TokensManager } from '../tokens';
import { arrayToUnionType, capitalize } from '../utils';
import { outdent } from 'outdent';
import { JUX_STYLED_PACKAGES, Project } from '../parsers';
import { StylesheetManager } from '../stylesheet';
import { JUX_FUNCTIONS } from '../parsers/file-parser.ts';
import { parseRawTokenSets } from '../utils/parse-raw-token-sets.ts';

interface PullAssetsOptions {
  components: string[];
}

export class JuxContext {
  /**
   * Responsible for parsing and managing tokens
   */
  public tokens: TokensManager;

  /**
   * For reading and writing files
   */
  public readonly fs: FileManager;

  /**
   * For communicating with the Jux API. Only available after login
   */
  private readonly juxApi?: JuxAPI;

  /**
   * The CLI configuration (jux.config.ts)
   */
  public readonly cliConfig: JuxCLIConfig;

  /**
   * Responsible for parsing source code files to generate the final CSS
   * @private
   */
  public readonly fileParser: Project;

  /**
   * The path to the config file
   */
  private readonly configPath: string;

  /**
   * The working directory. It's the directory where jux.config.ts is located
   * This is to make sure we can resolve relative paths in the config file relative to config's directory
   */
  public readonly cwd: string;

  /**
   * Responsible for generating the final CSS
   */
  public stylesheetManager: StylesheetManager;

  /**
   * Oclif's environment config. This is the config that is passed to the CLI.
   */
  private readonly environmentConfig: Config | undefined;

  constructor(config: LoadConfigRes) {
    this.tokens = new TokensManager({
      core: config.cliConfig.core_tokens,
      ...config.cliConfig.themes,
    });
    this.cliConfig = config.cliConfig;
    this.configPath = config.configPath;
    this.environmentConfig = config.environmentConfig;
    this.cwd = path.parse(this.configPath).dir;
    this.fs = new FileManager(this.cwd);

    this.fileParser = new Project({
      tsconfig: config.tsconfig,
      definitions_directory: this.cliConfig.definitions_directory,
    });

    this.juxApi =
      config.internalConfig && config.environmentConfig
        ? new JuxAPI(
            config.environmentConfig,
            config.internalConfig,
            config.apiConfig
          )
        : undefined;

    this.stylesheetManager = new StylesheetManager({
      cssVarsRoot: this.cliConfig.cssVarsRoot,
      tokensManager: this.tokens,
      preflight: !!this.cliConfig.preflight,
    });
  }

  get api() {
    if (!this.juxApi) {
      throw new Error('API is not initialized. Run `jux login` to login');
    }

    return this.juxApi;
  }

  public reloadTokens(tokens: Themes) {
    this.tokens = new TokensManager(tokens);
  }

  public async generateTokensDefinitions(): Promise<Asset[]> {
    const set = new Set<string>();

    for (const [name, token] of this.tokens.getTokensByCategory()) {
      set.add(
        `export type ${capitalize(name)}Token = ${arrayToUnionType(
          // Remove duplicates
          Array.from(new Set(token.map((t) => `{${t.finalizedTokenName}}`)))
        )};`
      );
    }

    set.add(`export interface Tokens {
              ${Array.from(this.tokens.getTokensByCategory().keys())
                .map((name) => {
                  return `${name}: ${capitalize(name)}Token;`;
                })
                .join('\n')}
      };`);

    return [
      {
        directory: path.join(this.cwd, this.cliConfig.definitions_directory),
        files: [
          {
            name: 'tokens.d.ts',
            content: await this.fs.prettierFormat(
              outdent.string(Array.from(set).join('\n\n'))
            ),
          },
        ],
      },
    ];
  }

  public async generateStyledDefinitions(): Promise<Asset[]> {
    const styledDefinitions = outdent`
      import React from 'react';
      import * as jux from '@juxio/react-styled';
      import type { Tokens } from './tokens';
      import type {
        BaseProps,
        CSSProperties,
        CSSPropertiesWithCustomValues,
        CustomTokensValues,
        CustomTypes,
        MergeWithOverrides,
      } from '@juxio/react-styled';
      
      export interface StyledVariants<
        Props extends BaseProps,
        CustomTokensValues extends CSSProperties = object,
        CustomTypes = object,
      > {
        props: Partial<Props> | ((props: Props) => boolean);
        style: CSSPropertiesWithCustomValues<Props, CustomTokensValues, CustomTypes>;
      }
      
      export interface StylesDefinition<Props extends BaseProps> {
        root: CSSPropertiesWithCustomValues<
          Props,
          CustomTokensValues<Tokens>,
          CustomTypes<Tokens>
        >;
        variants?: StyledVariants<
          Props,
          CustomTokensValues<Tokens>,
          CustomTypes<Tokens>
        >[];
      }
      
      export interface CreateStyledOptions {
        displayName?: string;
        shouldForwardProp?: (propName: string) => boolean;
      }
      
      export interface StyledComponent<Props extends BaseProps>
        extends React.ForwardRefExoticComponent<Props> {}
      
      export type CreateStyled = {
        <Component extends React.ElementType, Props extends BaseProps = {}>(
          component: Component,
          styles: StylesDefinition<Props>,
          options?: CreateStyledOptions
        ): StyledComponent<
          MergeWithOverrides<React.ComponentPropsWithRef<Component>, Props>
        >;
      };
      
      export const css = jux.css<Tokens>;
      
      export const styled = jux.styled as CreateStyled;
    `;
    return [
      {
        directory: path.join(this.cwd, this.cliConfig.definitions_directory),
        files: [
          {
            name: 'styled.ts',
            content: await this.fs.prettierFormat(styledDefinitions),
          },
        ],
      },
    ];
  }

  public async pullGeneratedComponentsCode(
    components: string[]
  ): Promise<Asset[]> {
    const generatedFiles =
      await this.api.pullGeneratedComponentsCode(components);

    return bluebird.map(generatedFiles, async (f) => {
      f.file.name = `${f.file.name}.tsx`;
      f.file.content = await this.fs.prettierFormat(
        this.fileParser.replaceImports(f.file.name, f.file.content, [
          {
            oldModule: JUX_STYLED_PACKAGES.react,
            newModule: path.relative(
              path.join(this.cwd, this.cliConfig.components_directory),
              path.join(
                this.cwd,
                this.cliConfig.definitions_directory,
                JUX_FUNCTIONS.STYLED
              )
            ),
          },
        ])
      );
      return {
        directory: path.join(this.cwd, this.cliConfig.components_directory),
        files: [f.file],
      };
    });
  }

  public async pullDesignTokens(reload = false): Promise<Asset[]> {
    const tokens = await this.api.pullDesignTokens();

    const parsedTokenSets = parseRawTokenSets(tokens);

    if (reload) {
      this.reloadTokens(parsedTokenSets);
    }

    return [
      {
        directory: path.join(this.cwd, this.cliConfig.tokens_directory),
        files: [
          ...(await bluebird.map(
            Object.keys(parsedTokenSets),
            async (tokenSetName) => {
              return {
                name: `${tokenSetName}.ts`,
                content: await this.fs.prettierFormat(outdent`
  /* This file is generated by Jux. For more information on how to use this file, visit https://jux.io/docs */
  
  export const ${tokenSetName} = ${JSON.stringify(parsedTokenSets[tokenSetName], null, 2)};
`),
              };
            }
          )),
          {
            name: 'index.ts',
            content: outdent`
            ${Object.keys(parsedTokenSets)
              .map((tokenSetName) => `export * from './${tokenSetName}';`)
              .join('\n')}
          `,
          },
        ],
      },
    ];
  }

  public async generateAssets(): Promise<Asset[]> {
    return [
      ...(await this.generateTokensDefinitions()),
      ...(await this.generateStyledDefinitions()),
    ];
  }

  public async pullAssets(options: PullAssetsOptions): Promise<Asset[]> {
    return [...(await this.pullGeneratedComponentsCode(options.components))];
  }

  public getFilesToWatch() {
    return this.fs.glob({
      include: this.cliConfig.include,
      exclude: this.cliConfig.exclude,
    });
  }
}
