import { css as cssFunction, CSS } from '@juxio/css';

export type * from '@juxio/css';
export { default as styled } from './styled';

/**
 * CSS function that returns a string of class name.
 */
export const css: CSS = cssFunction;
