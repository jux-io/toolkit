import { BEFORE_PARENT, getCssVariableName, TokensManager } from '../tokens';
import { walkObject } from './walk-object';
import { Tokens } from '../config';
import { getAliasMatches } from '@juxio/design-tokens';
import { transformDesignTokenValueToCss } from '../tokens/transform-design-token-value-to-css';
import { resolveTokenValue } from './resolve-token-value';

/**
 * Parses the styles given to css / styled function
 */
export function parseRawStyleObject(
  tokensManager: TokensManager,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseStyles: Record<string, any>,
  onTokenNotFound: (cssKey: string, value: string) => void
) {
  // We're creating classes for each composite tokens, so collect all composite tokens by category
  const compositeTokens = tokensManager.getCompositeTokensByCategory();

  return walkObject(baseStyles, (key, value) => {
    if (compositeTokens.has(key as keyof Tokens)) {
      const { valuePath } = getAliasMatches(value);
      if (!valuePath) {
        // if valuePath cannot be found, it means it does not contain any design token (required for composite tokens)
        return { type: 'remove' };
      }

      const compositeToken = compositeTokens
        .get(key as keyof Tokens)!
        .filter((t) => t.finalizedTokenName === valuePath);

      if (compositeToken.length === 0) {
        // User used non-existing composite token

        onTokenNotFound?.(key, value);

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
      const resolved = resolveTokenValue(value, (valuePath) => {
        const parsedToken = Array.from(tokensManager.tokensMap.values()).find(
          (t) => t.finalizedTokenName === valuePath
        );
        if (!parsedToken) {
          onTokenNotFound?.(key, value);

          // Token was not found, so just convert it to plain css variable
          return `var(${getCssVariableName(value)})`;
        }
        return `var(${parsedToken.cssVar})`;
      });

      return {
        type: 'replace',
        value: resolved.join(' '),
      };
    }

    return {
      type: 'replace',
      value: transformDesignTokenValueToCss(value),
    };
  });
}
