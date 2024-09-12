import { getCssVariableName, TokensManager } from '../tokens';
import { walkObject } from './walk-object';
import { transformDesignTokenValueToCss } from '../tokens/transform-design-token-value-to-css';
import { resolveTokenValue } from './resolve-token-value';
import { ConditionsManager } from '../conditions';
import { UtilitiesManager } from '../utilities';
import { getConditionValue } from './get-condition-value.ts';
import { getUtilityValue } from './get-utility-value.ts';

export interface ParseRawStyleObjectOptions {
  tokens: TokensManager;
  conditions: ConditionsManager;
  utilities: UtilitiesManager;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseStyles: Record<string, any>;
  onTokenNotFound?: (cssKey: string, value: string, valuePath: string) => void;
  onError?: (msg: string) => void;
}

/**
 * Parses the styles given to css / styled function and returns a valid CSS object
 */
export function parseRawStyleObject({
  tokens: tokensManager,
  conditions: conditionsManager,
  utilities: utilitiesManager,
  baseStyles,
  onTokenNotFound,
  onError,
}: ParseRawStyleObjectOptions) {
  return walkObject(baseStyles, (key, value) => {
    const conditionValue = getConditionValue(
      conditionsManager,
      key,
      value,
      onError
    );

    if (conditionValue) {
      return conditionValue;
    }

    const utilityValue = getUtilityValue(
      utilitiesManager,
      tokensManager,
      key,
      value,
      onError,
      onTokenNotFound
    );

    if (utilityValue) {
      return utilityValue;
    }

    // This is not a composite token, so we need to transform the value to CSS
    // Check if the value contains an alias token path, and check if it exists so we can give warning to user
    if (typeof value === 'string') {
      const resolved = resolveTokenValue(value, (valuePath) => {
        const parsedToken = Array.from(tokensManager.tokensMap.values()).find(
          (t) => t.finalizedTokenName === valuePath
        );
        if (!parsedToken) {
          onTokenNotFound?.(key, value, valuePath);

          // Token was not found, so just convert it to plain css variable
          return `var(${getCssVariableName(valuePath)})`;
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
