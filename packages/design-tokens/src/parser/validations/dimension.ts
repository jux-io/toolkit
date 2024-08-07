import { DesignTokenValidator } from '../../types';
import { dimensionTokenValueSchema } from '../../schemas';

export const validateDimensionTokenValue: DesignTokenValidator = (value) => {
  const validationResult = dimensionTokenValueSchema.safeParse(value);

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
