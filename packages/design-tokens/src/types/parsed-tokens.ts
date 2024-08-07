import { DesignTokenValue } from '../types';

export type ParsedTokenSetValuesMap = Map<string, DesignTokenValue>;
export type AliasesMap = Map<string, Set<string>>;

// This object is used to keep parsed tokens data,
// such as the valuesMap, aliasesMap, valuesByTypeMap (TBD), etc.,
// so that those data structures can be used by the DesignTokensParser or any of its modules
// to perform validations, query/mutate data, etc. as efficiently and as simply as possible.
export interface ParsedTokenSet {
  readonly valuesMap: ParsedTokenSetValuesMap;
  readonly aliasesMap: AliasesMap;
  // readonly valuesByTypeMap: Map<DesignTokenType, ParsedTokenSetValuesMap>;
}
