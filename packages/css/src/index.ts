import {
  CSSProperties,
  CSSPropertiesWithCustomValues,
  CustomTokensValues,
  Merge,
} from './base';
import cssFunction from './css';
import { Conditions, Tokens, Utilities } from './types';

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
const css: CSS = cssFunction;

export * from './base';
export { css };
export { calculateHash } from './utils/calculate-hash';
