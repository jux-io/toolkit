/**
 * Get the CSS variable name for a given token name.
 * ```
 * getCssVariableName('colors.primary.100') => '--colors-primary-100'
 * getCssVariableName('core.colors.primary.100') => '--core-colors-primary-100'
 * getCssVariableName('dark.colors.primary.+3') => '--colors-primary-3'
 * ```
 * @param name
 */
export function getCssVariableName(name: string) {
  // Convert to lowercase
  let result = name.toLowerCase();

  // Replace non-alphanumeric (while keeping dots and underscore) characters with underscore
  result = result.replace(/[^a-z0-9._-]+/g, '');

  // Remove leading digits or hyphens
  result = result.replace(/^[0-9-]+/, '');

  // Remove trailing hyphens
  result = result.replace(/-+$/, '');

  // Replace dots with hyphens
  result = result.replace(/\./g, '-');

  // Add the CSS variable prefix
  return `--${result}`;
}
