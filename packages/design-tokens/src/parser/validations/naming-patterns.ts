import { z } from 'zod';
import { NAMING_PATTERNS } from '../../constants';
import { DesignTokenValidator } from '../../types';

export const legalCharactersSchema = z
  .string()
  .regex(
    NAMING_PATTERNS.legalCharactersRegex.value,
    NAMING_PATTERNS.legalCharactersRegex.message
  );

export const nameLengthSchema = z
  .string()
  .min(1, 'Name must not be empty')
  .max(60, 'Name must not be longer than 60 characters');

export const namingPatternsSchema = z.intersection(
  nameLengthSchema,
  legalCharactersSchema
);

export const validateNamingPatterns: DesignTokenValidator<string, string> = (
  value
) => {
  const tokenNamesValidationResult = namingPatternsSchema.safeParse(value);

  if (
    !tokenNamesValidationResult.success &&
    'error' in tokenNamesValidationResult
  ) {
    return {
      success: false,
      error: tokenNamesValidationResult.error.message,
    };
  }

  return {
    success: true,
    data: tokenNamesValidationResult.data,
  };
};
