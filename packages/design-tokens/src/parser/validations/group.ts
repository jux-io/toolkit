import { DesignTokenGroupNameValidator } from '../../types';
import { validateNamingPatterns } from './naming-patterns';

export const validateGroupName: DesignTokenGroupNameValidator = ({
  allowOverwrite,
  containingGroupData,
  groupName,
}) => {
  if (!allowOverwrite && groupName in containingGroupData) {
    return {
      error: `Group name "${groupName}" already exists`,
      success: false,
    };
  }

  return validateNamingPatterns(groupName);
};
