import { CSSPropertiesWithCustomValues } from './base';
import cssFunction from './css';

export type CSS = (styles: CSSPropertiesWithCustomValues) => string;

/**
 * CSS function that returns a string of class name.
 */
const css: CSS = cssFunction;

export * from './base';
export { css };
export { calculateHash } from './utils/calculate-hash';
