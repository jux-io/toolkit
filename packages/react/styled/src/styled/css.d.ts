/**
 * CSS function that returns a string of class name.
 */

import type {
  CSSPropertiesWithCustomValues,
  CustomTokensValues,
  CustomTypes,
} from './base';

export type CSS = <Tokens>(
  styles: CSSPropertiesWithCustomValues<
    object,
    CustomTokensValues<Tokens>,
    CustomTypes<Tokens>
  >
) => string;

declare const css: CSS;

export default css;
