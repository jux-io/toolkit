import {
  CSSPropertiesWithCustomValues,
  CSSProperties,
  CustomTokensValues,
  Merge,
} from './base';

import type { Conditions, Tokens, Utilities } from '@juxio/css/types';

export type CSS = (
  styles: CSSPropertiesWithCustomValues<
    Merge<CSSProperties, CustomTokensValues<Tokens>>,
    Utilities,
    Conditions
  >
) => string;

/**
 * CSS function that returns a string of class name.
 */
export declare const css: CSS;
