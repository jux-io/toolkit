import { set } from 'lodash';
import { DesignToken, DesignTokens, DesignTokenValue } from '../../types';

export const setByPath = ({
  tokenOrGroupPath,
  tokenSet,
  value,
}: {
  readonly tokenSet: DesignTokens;
  tokenOrGroupPath: string;
  value: DesignTokens | DesignToken | DesignTokenValue;
}) => set(tokenSet, tokenOrGroupPath, value);
