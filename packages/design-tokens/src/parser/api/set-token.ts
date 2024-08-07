import z from 'zod';
import {
  DesignToken,
  DesignTokens,
  DesignTokensExtensions,
  DesignTokensValidators,
  DesignTokenTypeEnum,
  ParsedTokenSet,
} from '../../types';
import { getCurrentTimestamp } from '../helpers';
import { getAliasMatches, isAlias } from '../validations';
import { getByPath } from './get-by-path';

interface SetTokenParams {
  readonly tokenSet: DesignTokens;
  readonly parsedTokenSet: ParsedTokenSet;
  readonly validators: DesignTokensValidators;
  tokenData: DesignToken;
  tokenPath: string;
  // if true, existing token will be overwritten
  allowOverwrite?: boolean;
}

const tokenValueTypes = z.union([z.string(), z.number()]);

const tokenInputSchema = z.object({
  $description: z.string().optional(),
  $type: z.nativeEnum(DesignTokenTypeEnum),
  $value: z.union([
    tokenValueTypes,
    // Allow only one level of object nesting
    z.record(tokenValueTypes),
  ]),
  $extensions: z
    .object({
      createdAt: z.string().optional(),
    })
    .optional(),
});

export const setToken = ({
  allowOverwrite,
  tokenData,
  tokenPath,
  tokenSet,
  validators,
  parsedTokenSet,
}: SetTokenParams): DesignTokens => {
  // clone tokenSet to avoid mutating it
  const clonedTokenSet = structuredClone(tokenSet);

  const parts = tokenPath.split('.');
  // get the token name while removing it from the parts array
  const name = parts.pop();

  // get the containing group object
  const groupData = getByPath({
    tokenOrGroupPath: parts.join('.'),
    tokenSet: clonedTokenSet,
  }) as DesignTokens;

  if (!name || !groupData) {
    throw new Error(`Invalid path: ${tokenPath}`);
  }

  const nameValidationResult = validators.validateTokenName({
    allowOverwrite,
    groupData,
    name,
  });

  if (!nameValidationResult.success && 'error' in nameValidationResult) {
    throw new Error(nameValidationResult.error);
  }

  // TODO: handle zod error
  const newToken = tokenInputSchema.parse(tokenData);

  const { $type, $value } = newToken;

  // validate the value
  if (isAlias($value)) {
    // The alias is circular
    if (getAliasMatches($value).valuePath === tokenPath) {
      throw new Error(`Alias "${$value}" is circular.`);
    }

    const aliasValidationResult = validators.validateAliasTokenValue({
      tokenSetData: parsedTokenSet,
      alias: $value,
    });

    // The resolved alias value is invalid
    if (!aliasValidationResult.success && 'error' in aliasValidationResult) {
      throw new Error(aliasValidationResult.error);
    }
  } else {
    const valueValidatorFn = validators.valueByType[$type];

    if (!valueValidatorFn) {
      throw new Error(`Unsupported token type: ${$type}`);
    }

    const valueValidationResult = valueValidatorFn($value);

    // The value is invalid
    if (!valueValidationResult.success && 'error' in valueValidationResult) {
      throw new Error(valueValidationResult.error);
    }
  }

  const existingToken = groupData[name];

  // add the $extensions object if it doesn't exist
  // TODO: move extensions logic into separate module
  const $extensions =
    newToken.$extensions ||
    (existingToken?.$extensions as DesignTokensExtensions) ||
    {};

  // add createdAt if it doesn't exist
  if (!$extensions?.createdAt) {
    $extensions.createdAt = getCurrentTimestamp();
  }

  // mutate token set
  // overwrite properties instead of merge them
  groupData[name] = { ...existingToken, ...newToken, $extensions };

  // return the mutated token set
  return clonedTokenSet;
};
