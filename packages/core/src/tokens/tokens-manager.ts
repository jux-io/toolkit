import { type Themes, type Tokens } from '../config';
import { DesignTokensParser, DesignTokenValue } from '@juxio/design-tokens';
import { type TokenInfo, TokenParser, TokenTypes } from './token-parser';
import { underscore } from '../utils';

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
      const name = underscore(token);
      const path = token.split('.').map(underscore);
      const category = path[1] as keyof Tokens;

      const tokenInfo: TokenInfo = {
        name,
        type:
          typeof parsedTokens[token] === 'string'
            ? TokenTypes.VALUE
            : TokenTypes.COMPOSITE,
        path,
        value: parsedTokens[token],
        originalValue: rawValuesMap[token],
        category,
      };

      this.tokensMap.set(tokenInfo.name, new TokenParser(tokenInfo));
    });
  }

  get isEmpty() {
    return this.tokensMap.size === 0;
  }

  getTokensByCategory() {
    const byCategory = new Map<keyof Tokens, TokenParser[]>();
    // Add to category map
    Object.entries(
      Object.groupBy<keyof Tokens, TokenParser>(
        Array.from(this.tokensMap.values()),
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
      Object.groupBy(
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
      Object.groupBy(
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
      Object.groupBy<keyof Tokens, TokenParser>(
        Array.from(this.tokensMap.values()).filter((t) => t.isComposite),
        (t) => t.category
      )
    ).forEach(([key, value]) => {
      byCategory.set(key as keyof Tokens, value);
    });

    return byCategory;
  }
}
