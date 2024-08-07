/**
 * CSS function that returns a string of class name.
 */

import {
  BaseProps,
  CSSPropertiesWithCustomValues,
  CustomTokensValues,
  CustomTypes,
} from './base';

export type CSS = <Tokens extends BaseProps>(
  styles: CSSPropertiesWithCustomValues<
    object,
    CustomTokensValues<Tokens>,
    CustomTypes<Tokens>
  >
) => string;

declare const css: CSS;

export default css;
