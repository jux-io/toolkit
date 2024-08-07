import { type DesignTokenComposite, type DesignTokenValue } from '../../index';

export const isCompositeToken = (
  value: DesignTokenValue
): value is DesignTokenComposite =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);
