import { getAliasMatches, isAlias } from '@juxio/design-tokens';
import { formatTokenValue } from './format-token-value';
import { walkObject } from '../utils';

/**
 * Transforms a design token value to a CSS value.
 * @example
 * // Returns 'var(--core-color-brand-100)'
 * transformDesignTokenValueToCss('{core.color.brand_100}')
 *
 * // Returns { fontSize: 'var(--core-dimension-sm)', color: 'red' }
 * transformDesignTokenValueToCss({ fontSize: '{core.dimension.sm}', color: 'red' })
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformDesignTokenValueToCss(value: any) {
  if (typeof value === 'string' && isAlias(value)) {
    const { valuePath } = getAliasMatches(value);
    return value.replace(`{${valuePath}}`, formatTokenValue(valuePath));
  }

  return walkObject(value, (key, value) => {
    if (typeof value === 'string' && isAlias(value)) {
      const { valuePath } = getAliasMatches(value);

      // It's safe to assume that the valuePath exists in the map, since we added it this.parsedTokens function
      return {
        type: 'replace',
        value: value.replace(`{${valuePath}}`, formatTokenValue(valuePath)),
      };
    }
    return { type: 'replace', value };
  });
}
