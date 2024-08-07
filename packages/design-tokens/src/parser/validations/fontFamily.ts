import { DesignTokenValidator } from '../../types';
import { fontFamilyTokenValueSchema } from '../../schemas';

export const validateFontFamilyTokenValue: DesignTokenValidator = (value) => {
  const validationResult = fontFamilyTokenValueSchema.safeParse(value);

  if (!validationResult.success && 'error' in validationResult) {
    return {
      success: false,
      error: validationResult.error.message,
    };
  }

  return {
    success: true,
    data: validationResult.data,
  };
};
