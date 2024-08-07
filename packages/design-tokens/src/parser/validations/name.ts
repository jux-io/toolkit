import { DesignTokenNameValidator } from '../../types';
import { validateNamingPatterns } from './naming-patterns';

export const validateTokenName: DesignTokenNameValidator = ({
  groupData,
  name,
  allowOverwrite,
}) => {
  if (!allowOverwrite && name in groupData) {
    return { error: `Token name "${name}" already exists`, success: false };
  }

  return validateNamingPatterns(name);
};
