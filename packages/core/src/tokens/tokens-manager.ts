import { type Themes, type Tokens } from '../config';
import {
  DesignTokenComposite,
  DesignTokensParser,
  DesignTokenValue,
  getAliasMatches,
  isAlias,
} from '@juxio/design-tokens';
import { type TokenInfo, TokenParser, TokenTypes } from './token-parser';
import { underscore } from '../utils';
import { getCategoryByCssProperty } from '../utils/get-category-by-css-property';
import camelCase from 'lodash/camelCase';
import { groupBy } from 'lodash';

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
      let originalValue = rawValuesMap[token];

      if (isAlias(originalValue)) {
        const rawTokenValue = this.parsedTokens.getTokenRawValue(
          getAliasMatches(originalValue).valuePath,
          true
        );

        if (typeof rawTokenValue === 'object') {
          // We do this because in composite tokens (like typography), the value is an object and does not represent a single value
          // we can reference using var(--token-name), so we need to create a class for it. To do it properly, we need to keep the
          // original value of the token (recursively)
          originalValue = rawTokenValue;
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
        originalValue: originalValue,
        category,
      };

      this.tokensMap.set(tokenInfo.name, new TokenParser(tokenInfo));

      // add tokens for individual values in composite tokens
      if (tokenInfo.type === TokenTypes.COMPOSITE) {
        Object.entries(parsedTokens[token] as DesignTokenComposite).forEach(
          ([key, value]) => {
            const compositeTokenInfo: TokenInfo = {
              name: `${token}.${key}`,
              type: TokenTypes.VALUE,
              path: [...path, key],
              value,
              originalValue: value,
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
      groupBy<TokenParser>(
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
        view.set(token.cssVar, token.cssVarValue);
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
      groupBy(
        Array.from(this.tokensMap.values()).filter((t) => !t.isCore),
        // In non-core tokens, the first path is the theme name
        (t) => t.path[0]
      )
    ).forEach(([key, value]) => {
      if (!view[key]) view[key] = {};
      view[key] = (value as TokenParser[]).reduce(
        (acc, t) => {
          if (!t.isComposite) {
            acc[t.cssVar] = t.cssVarValue;
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

  getCoreCompositeTokens() {
    const parsers = new Map<string, TokenParser>();
    const view: Record<string, DesignTokenValue> = {};

    for (const [key, token] of this.tokensMap.entries()) {
      if (token.isCore && token.isComposite) {
        parsers.set(key, token);
        if (!view[token.compositeClassName]) {
          view[token.compositeClassName] = token.cssVarValue;
        }
      }
    }

    return {
      parsers,
      view,
    };
  }

  getThemesCompositeTokens() {
    const parsers = new Map<string, TokenParser[]>();
    const view: Record<string, Record<string, DesignTokenValue>> = {};

    Object.entries(
      groupBy(
        Array.from(this.tokensMap.values()).filter(
          (t) => !t.isCore && t.isComposite
        ),
        // In non-core tokens, the first path is the theme name
        (t) => t.path[0]
      )
    ).forEach(([key, value]) => {
      if (!view[key]) view[key] = {};
      view[key] = (value as TokenParser[]).reduce(
        (acc, t) => {
          acc[t.compositeClassName] = t.cssVarValue;
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
      groupBy<TokenParser>(
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
}
