import { WalkCallback } from './walk-object.ts';
import { ParseRawStyleObjectOptions } from './parse-raw-style-object.ts';
import { UtilitiesManager } from '../utilities';
import { getCssVariableName, TokenParser, TokensManager } from '../tokens';
import { resolveTokenValue } from './resolve-token-value.ts';

function getResolvedTokenValue(
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  tokensManager: TokensManager,
  onTokenNotFound: ParseRawStyleObjectOptions['onTokenNotFound']
) {
  const foundTokens: TokenParser[] = [];
  const resolved = resolveTokenValue(value, (valuePath) => {
    const parsedTokens = Array.from(tokensManager.tokensMap.values()).filter(
      (t) => t.finalizedTokenName === valuePath
    );

    if (parsedTokens.length === 0) {
      onTokenNotFound?.(key, value, valuePath);

      // Token was not found, so just convert it to plain css variable
      return `var(${getCssVariableName(valuePath)})`;
    }

    foundTokens.push(...parsedTokens);

    // For multi-theme tokens, it doesn't matter which token we use here, as cssVar will be identical for both
    return parsedTokens[0].isComposite
      ? parsedTokens.map((t) => t.value)
      : `var(${parsedTokens[0].cssVar})`;
  });

  return {
    foundTokens,
    resolved: resolved.flat(),
  };
}

/**
 * This is a helper function used in conjunction with {@link parseRawStyleObject} to get the value of a condition
 * ```
 * // Considering we have a screen condition named "desktop" in jux.config.ts
 * const conditionValue = getConditionValue(conditionsManager, key = 'desktop', value = { color: 'red' });
 *
 * // Returns { type: 'replace', key: '@media (width >= 768px) and (width <= 1024px)', value: { color: 'red' } }
 * ```
 */
export function getUtilityValue(
  utilitiesManager: UtilitiesManager,
  tokensManager: TokensManager,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  onError: ParseRawStyleObjectOptions['onError'],
  onTokenNotFound: ParseRawStyleObjectOptions['onTokenNotFound']
): ReturnType<WalkCallback> {
  const utility = utilitiesManager.utilities.get(key);
  if (utility) {
    if (typeof value === 'string') {
      const { foundTokens, resolved } = getResolvedTokenValue(
        key,
        value,
        tokensManager,
        onTokenNotFound
      );

      const transformedValue = utility.transform(resolved, {
        tokensManager,
        tokens: foundTokens,
        rawValue: value,
      });

      return transformedValue
        ? {
            type: 'merge_with_parent',
            value: transformedValue,
          }
        : {
            type: 'remove',
          };
    } else if (typeof value === 'object') {
      onError?.(`Objects cannot be used as values for utilities.`);
      return {
        type: 'remove',
      };
    } else {
      const transformedValue = utility.transform(value, {
        tokensManager,
        tokens: [],
        rawValue: value,
      });

      return value
        ? {
            type: 'merge_with_parent',
            value: transformedValue,
          }
        : {
            type: 'remove',
          };
    }
  }
}
