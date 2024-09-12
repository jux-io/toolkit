import { type Themes, type Tokens } from '../config';
import {
  DesignTokenComposite,
  DesignTokensParser,
  DesignTokenValue,
  getAliasMatches,
  isAlias,
} from '@juxio/design-tokens';
import { type TokenInfo, TokenParser, TokenTypes } from './token-parser';
import { arrayToUnionType, underscore } from '../utils';
import { getCategoryByCssProperty } from '../utils/get-category-by-css-property';
import camelCase from 'lodash/camelCase';
import lodash from 'lodash';
import { outdent } from 'outdent';

export interface TokensView {
  cssVars: Map<string, Map<string, DesignTokenValue>>;
}

export class TokensManager {
  private parsedTokens: DesignTokensParser;

  tokensMap = new Map<string, TokenParser>();

  constructor(themes: Themes) {
    this.parsedTokens = new DesignTokensParser(themes);

    this.parseTokens();
  }

  private parseTokens() {
    const parsedTokens = this.parsedTokens.getValuesMap();
    const rawValuesMap = this.parsedTokens.getRawValuesMap();

    // Parse core tokens
    Object.keys(parsedTokens).forEach((token) => {
      const path = token.split('.').map(underscore);

      // path is snake_case (e.g. font_family), but we want camelCase for the category
      const category = camelCase(path[1]) as keyof Tokens;

      // Get the raw, original value of the token (an alias or a value)
      // in case it's an alias, it can point to either a value or a composite token
      let rawValue = rawValuesMap[token];

      if (isAlias(rawValue)) {
        const rawTokenValue = this.parsedTokens.getTokenRawValue(
          getAliasMatches(rawValue).valuePath,
          true
        );

        if (typeof rawTokenValue === 'object') {
          // We do this because in composite tokens (like typography), the value is an object and does not represent a single value
          // we can reference using var(--token-name), so we need to create a class for it. To do it properly, we need to keep the
          // original value of the token (recursively)
          rawValue = rawTokenValue;
        }
      }

      const tokenInfo: TokenInfo = {
        name: token,
        type:
          typeof parsedTokens[token] === 'string'
            ? TokenTypes.VALUE
            : TokenTypes.COMPOSITE,
        path,
        value: parsedTokens[token],
        rawValue: rawValue,
        category,
      };

      this.tokensMap.set(tokenInfo.name, new TokenParser(tokenInfo));

      // add tokens for individual values in composite tokens
      if (tokenInfo.type === TokenTypes.COMPOSITE) {
        Object.entries(parsedTokens[token] as DesignTokenComposite).forEach(
          ([key]) => {
            const compositeTokenInfo: TokenInfo = {
              name: `${token}.${key}`,
              type: TokenTypes.VALUE,
              path: [...path, key],
              value: (this.tokensMap.get(token)!.value as DesignTokenComposite)[
                key
              ],
              rawValue: (
                this.tokensMap.get(token)!.rawValue as DesignTokenComposite
              )[key],
              category: getCategoryByCssProperty(key),
            };

            this.tokensMap.set(
              compositeTokenInfo.name,
              new TokenParser(compositeTokenInfo)
            );
          }
        );
      }
    });
  }

  get isEmpty() {
    return this.tokensMap.size === 0;
  }

  getTokensByCategory() {
    const byCategory = new Map<keyof Tokens, TokenParser[]>();
    // Add to category map
    Object.entries(
      lodash.groupBy<TokenParser>(
        Array.from(this.tokensMap.values()).filter((t) => t.category),
        (t) => t.category
      )
    ).forEach(([key, value]) => {
      byCategory.set(key as keyof Tokens, value);
    });

    return byCategory;
  }

  getCoreTokens() {
    const parsers = new Map<string, TokenParser>();
    const view = new Map<string, DesignTokenValue>();

    for (const [key, token] of this.tokensMap.entries()) {
      if (token.isCore && !token.isComposite) {
        parsers.set(key, token);
        view.set(token.cssVar, token.value);
      }
    }

    return {
      parsers,
      view,
    };
  }

  getThemesTokens() {
    const parsers = new Map<string, TokenParser[]>();
    const view: Record<string, Record<string, DesignTokenValue>> = {};

    Object.entries(
      lodash.groupBy(
        Array.from(this.tokensMap.values()).filter((t) => !t.isCore),
        // In non-core tokens, the first path is the theme name
        (t) => t.path[0]
      )
    ).forEach(([key, value]) => {
      if (!view[key]) view[key] = {};
      view[key] = value.reduce(
        (acc, t) => {
          if (!t.isComposite) {
            acc[t.cssVar] = t.value;
          }
          return acc;
        },
        {} as Record<string, DesignTokenValue>
      );

      parsers.set(key, value as TokenParser[]);
    });

    return {
      parsers,
      view,
    };
  }

  getCompositeTokensByCategory() {
    const byCategory = new Map<keyof Tokens, TokenParser[]>();
    // Add to category map
    Object.entries(
      lodash.groupBy<TokenParser>(
        Array.from(this.tokensMap.values()).filter(
          (t) => t.isComposite && t.category
        ),
        (t) => t.category
      )
    ).forEach(([key, value]) => {
      byCategory.set(key as keyof Tokens, value);
    });

    return byCategory;
  }

  getTokenByName(name: string) {
    return this.tokensMap.get(name);
  }

  /**
   * Get the type declaration for the utilities
   */
  public getTokensDeclaration() {
    const designTokenDefinitions = new Set<string>();

    for (const [name, token] of this.getTokensByCategory()) {
      designTokenDefinitions.add(
        `export type ${lodash.upperFirst(name)}Token = ${arrayToUnionType(
          // Remove duplicates
          Array.from(new Set(token.map((t) => `{${t.finalizedTokenName}}`)))
        )};`
      );
    }

    const tokenTypes = Array.from(this.getTokensByCategory().keys())
      .map((name) => {
        return `${camelCase(name)}: ${lodash.upperFirst(name)}Token;`;
      })
      .join('\n');

    return {
      designTokenDefinitions: Array.from(designTokenDefinitions).join('\n\n'),
      tokenTypes: outdent`
        export interface Tokens {
            ${tokenTypes}
        }
      `,
    };
  }
}
