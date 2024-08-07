import { AliasesMap, DesignTokens, DesignTokensValidators } from '../../types';
import { getByPath } from './get-by-path';
import { updateAffectedAliases } from './update-affected-aliases';

// TODO: rename this to moveToken
//   (also rename the file and any other references and usages including all apis and frontend)
export const renameToken = ({
  oldPath,
  newPath,
  tokenSet,
  validators,
  aliasesMap,
}: {
  readonly tokenSet: DesignTokens;
  readonly validators: DesignTokensValidators;
  readonly aliasesMap: AliasesMap;
  newPath: string;
  oldPath: string;
}): DesignTokens => {
  // clone tokenSet to avoid mutating it
  const clonedTokenSet = structuredClone(tokenSet);

  const oldPathParts = oldPath.split('.');
  const newPathParts = newPath.split('.');

  // get the token name while removing it from the parts array
  const oldName = oldPathParts.pop();
  const newName = newPathParts.pop();

  // get the containing group object
  const oldGroupData = getByPath({
    tokenOrGroupPath: oldPathParts.join('.'),
    tokenSet: clonedTokenSet,
  });

  const newGroupData = getByPath({
    tokenOrGroupPath: newPathParts.join('.'),
    tokenSet: clonedTokenSet,
  });

  if (!oldName || !oldGroupData) {
    throw new Error(`Invalid path: ${oldPath}`);
  }

  if (!newName || !newGroupData) {
    throw new Error(`Invalid path: ${newPath}`);
  }

  const nameValidationResult = validators.validateTokenName({
    groupData: newGroupData,
    name: newName,
  });

  if (!nameValidationResult.success && 'error' in nameValidationResult) {
    throw new Error(nameValidationResult.error);
  }

  // rename the token
  newGroupData[newName] = oldGroupData[oldName];

  // delete the old token
  delete oldGroupData[oldName];

  const affectedPaths = aliasesMap.get(oldPath);

  if (affectedPaths && affectedPaths.size > 0) {
    updateAffectedAliases({
      paths: affectedPaths,
      tokenSet: clonedTokenSet,
      value: newPath,
    });
  }

  return clonedTokenSet;
};
