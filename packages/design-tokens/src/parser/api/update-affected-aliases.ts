import { DesignTokens } from '../../types';
import { formatToAlias } from '../validations';
import { setByPath } from './set-by-path';

// mutates the tokenSet
export const updateAffectedAliases = ({
  paths,
  tokenSet,
  value,
}: {
  paths: Iterable<string>;
  tokenSet: DesignTokens;
  value: string;
}): DesignTokens => {
  for (const tokenOrGroupPath of paths) {
    setByPath({
      tokenOrGroupPath,
      tokenSet,
      value: formatToAlias(value),
    });
  }

  return tokenSet;
};
