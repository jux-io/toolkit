import lodash from 'lodash';
import { DesignTokens } from '../../types';

export const getByPath = ({
  tokenOrGroupPath,
  tokenSet,
}: {
  readonly tokenSet: DesignTokens;
  tokenOrGroupPath?: string;
}) => (tokenOrGroupPath ? lodash.get(tokenSet, tokenOrGroupPath) : tokenSet);
