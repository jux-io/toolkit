import {
  getAliasMatches,
  isAliasPattern,
  isMultiValues,
} from '@juxio/design-tokens';

export const resolveTokenValue = (
  value: string,
  resolveFn: (valuePath: string) => string
) => {
  // if value is a combination of multiple values, return a function that uses the theme
  // to resolve each value and returns the combined string
  // e.g. "1px solid {color.primary}" => "1px solid lightsalmon"
  if (isMultiValues(value)) {
    return value
      .split(' ')
      .map((val) =>
        isAliasPattern(val) ? resolveFn(getAliasMatches(val).valuePath) : val
      );
  }
  // // if the value is an alias, return a function that uses the theme
  if (isAliasPattern(value)) {
    return [resolveFn(getAliasMatches(value).valuePath)];
  }
  // // otherwise return the value as is
  return [value];
};
