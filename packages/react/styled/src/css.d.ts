/**
 * CSS function that returns a string of class name.
 */

import {
  CSSPropertiesWithCustomValues,
  CustomTokensValues,
  CustomTypes,
} from './base';

import { Tokens } from './tokens';

export type CSS = (
  styles: CSSPropertiesWithCustomValues<
    object,
    CustomTokensValues<Tokens>,
    CustomTypes<Tokens>
  >
) => string;

declare const css: CSS;

export default css;
