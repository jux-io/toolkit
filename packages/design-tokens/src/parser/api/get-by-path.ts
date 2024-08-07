import { get } from 'lodash';
import { DesignTokens } from '../../types';

export const getByPath = ({
  tokenOrGroupPath,
  tokenSet,
}: {
  readonly tokenSet: DesignTokens;
  tokenOrGroupPath?: string;
}) => (tokenOrGroupPath ? get(tokenSet, tokenOrGroupPath) : tokenSet);
