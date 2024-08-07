/**
 * Get the CSS variable name for a given token name.
 * ```
 * getCssVariableName('colors.primary.100') => '--colors-primary-100'
 * ```
 * @param name
 */
export function getCssVariableName(name: string) {
  return `--${name.replace(/\./g, '-')}`;
}
