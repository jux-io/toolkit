import { getCssVariableName } from './get-css-variable-name';
import { underscore } from '../utils';
import { CORE_TOKEN_IDENTIFIER } from './token-parser';

/**
 * Format token value to be used in CSS
 * In case it's a non-core token (theme token), no need to add the theme prefix (to maintain consistency across themes)
 * ```
 * ❌ - var(--dark-colors-primary-100)
 * ✅ - var(--colors-primary-100)
 * ```
 * ```
 * formatTokenValue('dark.colors.primary_100') => 'var(--colors-primary-100)'
 * formatTokenValue('core.colors.primary_100') => 'var(--core-colors-primary-100)'
 * ```
 * @param value
 */
export function formatTokenValue(value: string) {
  const path = value.split('.');
  if (path.at(0) === CORE_TOKEN_IDENTIFIER || path.length === 1) {
    return `var(${getCssVariableName(underscore(value))})`;
  } else {
    return `var(${getCssVariableName(underscore(path.splice(1).join('.')))})`;
  }
}
