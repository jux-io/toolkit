import { AliasesMap, DesignTokens } from '../../types';
import { getByPath } from '../api';

export const deleteByPath = ({
  tokenSet,
  aliasesMap,
  path,
}: {
  readonly tokenSet: DesignTokens;
  readonly aliasesMap: AliasesMap;
  path: string;
}): DesignTokens => {
  const affectedPaths = aliasesMap.get(path);

  if (affectedPaths && affectedPaths.size > 0) {
    throw new Error(
      `Cannot delete token or group at path "${path}" because it is being aliased by the following tokens: ${Array.from(
        affectedPaths
      )
        .map((p) => `"${p.replaceAll('.$value', '')}"`)
        .join(', ')}`
    );
  }

  // clone tokenSet to avoid mutating it
  const clonedTokenSet = structuredClone(tokenSet);

  const pathParts = path.split('.');

  const name = pathParts.pop();

  const groupData = getByPath({
    tokenSet: clonedTokenSet,
    tokenOrGroupPath: pathParts.join('.'),
  });

  if (!name || !groupData || !(name in groupData)) {
    throw new Error(`Invalid path: ${path}`);
  }

  delete groupData[name];

  return clonedTokenSet;
};
