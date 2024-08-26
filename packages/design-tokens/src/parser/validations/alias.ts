import {
  DesignTokenType,
  DesignTokenValue,
  DesignTokenValueAliasValidator,
} from '../../types';

const ALIAS_PATTERN_REGEX = /\{(.*)}/;

export const getAliasMatches = (value: string) => {
  const [, valuePath, ...unexpectedMatches] =
    value.match(ALIAS_PATTERN_REGEX) || [];
  return { valuePath, unexpectedMatches };
};

export const isMultiValues = (value: string | undefined): boolean => {
  const valueArray = value?.split(' ') ?? [];
  return valueArray.length > 1;
};

export const isAliasPattern = (value: string): boolean =>
  ALIAS_PATTERN_REGEX.test(value);

export const isAlias = (value: DesignTokenValue): value is string =>
  typeof value === 'string' && isAliasPattern(value);

export const isAliasToTokenType = (alias: string, tokenType: DesignTokenType) =>
  alias?.startsWith(`{${tokenType}`);

export const startWithAlias = (value: string, startWith: string) =>
  value.startsWith(`{${startWith}`);

export const formatToAlias = (tokenPath: DesignTokenValue) => `{${tokenPath}}`;

const PATH_SEPARATOR = '.';
export const concatTokenPath = (tokenPath: string, fieldName: string) =>
  `${tokenPath}${PATH_SEPARATOR}${fieldName}`;

export const validateAliasTokenValue: DesignTokenValueAliasValidator = ({
  alias,
  tokenSetData,
}) => {
  // Return error message if contains invalid characters or nested alias
  if (!isAlias(alias)) {
    return { error: `Alias "${alias}" is invalid.`, success: false };
  }

  const { valuePath, unexpectedMatches } = getAliasMatches(alias);

  // Values with multiple aliases are not supported
  if (unexpectedMatches.length) {
    return {
      error: `Alias "${alias}" contains multiple paths`,
      success: false,
    };
  }

  // Lookup value in provided token set
  const value = tokenSetData.valuesMap.get(valuePath);

  // Return error message if not found
  if (!value) {
    return { error: `Alias "${alias}" is not defined.`, success: false };
  }

  // Return error message if circular
  if (value === alias) {
    return { error: `Alias "${alias}" is circular.`, success: false };
  }

  // Return error message if value is also an alias
  if (isAlias(value)) {
    return {
      error: `Alias "${alias}" references another alias.`,
      success: false,
    };
  }

  return { success: true, data: value };
};
