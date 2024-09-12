import * as CSS from 'csstype';

export type CSSProperties = CSS.PropertiesFallback<number | string>;
export type CSSPropertiesWithMultiValues = {
  [K in keyof CSSProperties]:
    | CSSProperties[K]
    | readonly Extract<CSSProperties[K], string>[];
};

export type ArrayCSSInterpolation = readonly CSSInterpolation[];

export type InterpolationPrimitive =
  | null
  | undefined
  | boolean
  | number
  | string
  | CSSObject;

export type CSSInterpolation = InterpolationPrimitive | ArrayCSSInterpolation;

export interface CSSObject
  extends CSSPropertiesWithMultiValues,
    CSSPseudos,
    CSSOthersObject {}

export type CSSOthersObject = Record<string, CSSInterpolation>;

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };
