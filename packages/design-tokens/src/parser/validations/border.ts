import { DesignTokenBorderValueValidator, BorderTokenValue } from '../../types';

const validateColor = (color: BorderTokenValue['borderColor']) =>
  // TODO: Implement
  color?.length ? '' : `Invalid color ${color}`;

export const validateBorderTokenValue: DesignTokenBorderValueValidator = (
  value
) => {
  if (value.borderColor) {
    const borderColorError = validateColor(value.borderColor);
    if (borderColorError) {
      return { error: borderColorError, success: false };
    }
  }
  // TODO: Validate other color properties
  return { data: value, success: true };
};
