import {
  DesignTokens,
  DesignTokenType,
  DesignTokenValue,
} from './design-tokens.interface';
import {
  TypographyTokenValue,
  BorderTokenValue,
} from './design-tokens-value-types';
import { ParsedTokenSet } from './parsed-tokens';

export type DesignTokenValidationResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T = any,
> =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      data: T;
    };

// Generic validator function interface which is used by all DesignTokensParser validators
export type DesignTokenValidator<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TValue = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TResultData = any,
> = (value: TValue) => DesignTokenValidationResult<TResultData>;

export type DesignTokenValueAliasValidator = DesignTokenValidator<
  {
    tokenSetData: ParsedTokenSet;
    alias: string;
  },
  DesignTokenValue
>;

export type DesignTokenTypographyValueValidator =
  DesignTokenValidator<TypographyTokenValue>;

export type DesignTokenBorderValueValidator =
  DesignTokenValidator<BorderTokenValue>;

export type DesignTokenNameValidator = DesignTokenValidator<{
  groupData: DesignTokens;
  name: string;
  allowOverwrite?: boolean;
}>;

export type DesignTokenGroupNameValidator = DesignTokenValidator<{
  containingGroupData: DesignTokens;
  groupName: string;
  allowOverwrite?: boolean;
}>;

export interface DesignTokensValidators {
  readonly validateGroupName: DesignTokenGroupNameValidator;
  readonly validateTokenName: DesignTokenNameValidator;
  readonly validateAliasTokenValue: DesignTokenValueAliasValidator;
  readonly valueByType: Partial<{
    readonly [key in DesignTokenType]: DesignTokenValidator;
  }>;
}
