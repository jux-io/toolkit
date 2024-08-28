import { AliasesMap, DesignTokens, DesignTokensValidators } from '../../types';
import { getCurrentTimestamp } from '../helpers';
import { getByPath } from './get-by-path';
import { updateAffectedAliases } from './update-affected-aliases';

// This updates the group data (name and description) and returns a new tokenSet.
// Currently, groups can only be created or updated, not deleted
export const setGroup = ({
  allowOverwrite,
  description,
  groupName,
  groupPath = '',
  oldName,
  tokenSet,
  validators,
  aliasesMap,
}: {
  readonly tokenSet: DesignTokens;
  readonly validators: DesignTokensValidators;
  groupName: string;
  // if true, existing group will be overwritten
  allowOverwrite?: boolean;
  // if included, description will be added/updated
  description?: string;
  // if omitted, root path will be used
  groupPath?: string;
  // if included, existing group will be renamed and updated
  // if such group doesn't exist, error will be thrown
  oldName?: string;
  aliasesMap: AliasesMap;
}): DesignTokens => {
  // clone tokenSet to avoid mutating it
  const clonedTokenSet = structuredClone(tokenSet);
  const containingGroupData = getByPath({
    tokenOrGroupPath: groupPath,
    tokenSet: clonedTokenSet,
  }) as DesignTokens;

  // validate the group name
  const nameValidationResult = validators.validateGroupName({
    allowOverwrite,
    groupName,
    containingGroupData,
  });
  if (!nameValidationResult.success && 'error' in nameValidationResult) {
    throw new Error(nameValidationResult.error);
  }

  let groupData: DesignTokens;

  // if oldName is included
  if (oldName) {
    // validate that it exists
    if (!(oldName in containingGroupData)) {
      throw new Error(
        `Group "${oldName}" doesn't exist in path "${groupPath}"`
      );
    }

    // copy the old group data
    groupData = containingGroupData[oldName] as DesignTokens;

    // validate the expected data structure
    if (Object.prototype.toString.call(groupData) !== '[object Object]') {
      throw new Error(`Invalid group data: ${groupData}, path: ${groupPath}`);
    }

    const oldPath = groupPath ? `${groupPath}.${oldName}` : oldName;
    const newPath = groupPath ? `${groupPath}.${groupName}` : groupName;

    // find affected paths that match the old group name
    const relevantTokensInGroup = Array.from(aliasesMap.entries()).filter(
      ([tokenPath]) => tokenPath.startsWith(oldPath)
    );

    // update affected aliases for each relevant token path
    for (const [tokenPath, affectedAliases] of relevantTokensInGroup) {
      updateAffectedAliases({
        paths: affectedAliases,
        tokenSet: clonedTokenSet,
        value: tokenPath.replace(oldPath, newPath),
      });
    }

    // delete the old group data
    delete containingGroupData[oldName];
  }
  // if oldName is not included
  else {
    groupData = (
      allowOverwrite && groupName in containingGroupData
        ? // if we allow overwriting, use the existing data
          containingGroupData[groupName]
        : // otherwise, create a new object
          {}
    ) as DesignTokens;
  }

  // put the copied data in the containing group
  containingGroupData[groupName] = groupData;

  // update the group's description
  if (description !== undefined) {
    containingGroupData[groupName].$description = description;
  }

  // add the $extensions object if it doesn't exist
  // TODO: move extensions logic into separate module
  if (!groupData.$extensions) {
    groupData.$extensions = {
      createdAt: getCurrentTimestamp(),
    };
  }

  return clonedTokenSet;
};
