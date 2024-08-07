import { Properties } from 'csstype';

export type ColorTokenValue = string;

export type TypographyTokenValue = Pick<
  Properties,
  'fontFamily' | 'fontSize' | 'fontWeight' | 'letterSpacing' | 'lineHeight'
>;

export type BorderTokenValue = Pick<
  Properties,
  'borderColor' | 'borderWidth' | 'borderStyle'
>;
