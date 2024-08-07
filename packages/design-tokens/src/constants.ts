import { DesignTokenTypeEnum } from './types';

export const NAMING_PATTERNS = {
  legalCharactersRegex: {
    value: /^[:\sa-zA-Z0-9_-]+$/,
    message: 'Use letters, numbers, hyphens, and underscores',
  },
} as const;

export const compositeTokenTypes = [DesignTokenTypeEnum.typography] as const;

export const supportedTokenTypes = [
  DesignTokenTypeEnum.color,
  DesignTokenTypeEnum.dimension,
  DesignTokenTypeEnum.fontFamily,
  DesignTokenTypeEnum.typography,
  DesignTokenTypeEnum.border,
] as const;

export const DIMENSION_TOKEN_VALUE_UNITS = [
  'px',
  'rem',
  'em',
  '%',
  'vw',
  'vh',
] as const;

export const DIMENSION_TOKEN_VALUE_REGEX = new RegExp(
  `^(\\d*(\\.\\d+)?(${DIMENSION_TOKEN_VALUE_UNITS.join('|')}))?$`
);

export const DIMENSION_DEFINITION_MESSAGE = `number followed by a unit (${DIMENSION_TOKEN_VALUE_UNITS.join(
  ', '
)})`;

export const DIMENSION_TOKEN_VALUE_REGEX_MESSAGE = `Enter a ${DIMENSION_DEFINITION_MESSAGE}`;

export const NUMBER_TOKEN_VALUE_REGEX = /^\d*(\.\d+)?$/;

export const NUMBER_TOKEN_VALUE_REGEX_MESSAGE = 'Enter a number';

export const FONT_WEIGHT_VALUE_REGEX =
  /normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900/;

export const FONT_WEIGHT_VALUE_REGEX_MESSAGE = 'Invalid font weight';

export const COLOR_TOKEN_VALUE_REGEX = new RegExp(
  /^rgba\((\d{1,3}\s*){3}\/\s*\d{1,3}%\s*\)$/
);

export const STROKE_STYLE_OPTIONS: string[] = [
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'outset',
  'inset',
];

export const STROKE_STYLE_TOKEN_VALUE_REGEX = new RegExp(
  /^(solid|dashed|dotted|double|groove|ridge|outset|inset)$/
);

export const COLOR_TOKEN_VALUE_REGEX_MESSAGE = `Invalid color value - must be a valid rgba() value`;

export const STROKE_STYLE_TOKEN_VALUE_REGEX_MESSAGE = `Invalid style - must be a valid stroke style`;

export const COLOR_TOKEN_OPACITY_MIN = 0;

export const COLOR_TOKEN_OPACITY_MAX = 100;

export const COLOR_TOKEN_OPACITY_RANGE_MESSAGE = `${COLOR_TOKEN_OPACITY_MIN}-${COLOR_TOKEN_OPACITY_MAX}`;
