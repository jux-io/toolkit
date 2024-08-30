/**
 * CSS function that returns a string of class name.
 */

import {
  CSSPropertiesWithCustomValues,
  CSSProperties,
  CustomTokensValues,
  CustomTypes,
  Merge,
} from './base';

import { Tokens } from './tokens';

export interface CSS {
  (
    styles: CSSPropertiesWithCustomValues<
      object,
      Merge<CSSProperties, CustomTokensValues<Tokens>>,
      CustomTypes<Tokens>
    >
  ): string;

  (styles: CSSPropertiesWithCustomValues): string;
}

export declare const css: CSS;
