import {
  DesignTokenTypographyValueValidator,
  TypographyTokenValue,
} from '../../types';

const validateFontFamily = (fontFamily: TypographyTokenValue['fontFamily']) =>
  // TODO: Implement
  fontFamily?.length ? '' : `Invalid font family ${fontFamily}`;

export const validateTypographyTokenValue: DesignTokenTypographyValueValidator =
  (value) => {
    if (value.fontFamily) {
      const fontFamilyError = validateFontFamily(value.fontFamily);
      if (fontFamilyError) {
        return { error: fontFamilyError, success: false };
      }
    }
    // TODO: Validate other typography properties
    return { data: value, success: true };
  };
