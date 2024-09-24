import '@juxio/css/types';

export type ColorToken =
  | '{core.color.brand_100}'
  | '{core.color.brand_200}'
  | '{color.primary}';

export type DimensionToken =
  | '{core.dimension.spacing_100}'
  | '{dimension.specific.button_radius}';

declare module '@juxio/css/types' {
  export interface Tokens {
    color: ColorToken;
    dimension: DimensionToken;
  }

  export interface Utilities {
    typography?: TypographyToken;
  }
}
