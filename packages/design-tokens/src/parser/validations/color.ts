import { DesignTokenValidator } from '../../types';

export const validateColorTokenValue: DesignTokenValidator = (value) =>
  // if hex -> validate hex
  // else if rgb -> validate rgb
  // else -> validate known css color names
  // TODO: Implement
  ({ data: value, success: true });
