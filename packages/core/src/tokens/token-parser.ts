import { type DesignTokenValue } from '@juxio/design-tokens';
import { type Tokens } from '../config';
import { getCssVariableName } from './get-css-variable-name.ts';
import { transformDesignTokenValueToCss } from './transform-design-token-value-to-css.ts';

export interface TokenInfo {
  name: string;
  type: TokenTypes;
  path: string[];
  value: DesignTokenValue;
  /* The calculated value of this token, in case of semantic token */
  originalValue: DesignTokenValue;
  category: keyof Tokens | undefined | null;
  description?: string;
}

export enum TokenTypes {
  VALUE = 'value',
  COMPOSITE = 'composite',
}

export const CORE_TOKEN_IDENTIFIER = 'core';

export class TokenParser {
  name: TokenInfo['name'];
  type: TokenTypes;
  isCore: boolean;

  themeName?: string;

  value: TokenInfo['value'];
  originalValue: TokenInfo['originalValue'];

  path: TokenInfo['path'];
  category: TokenInfo['category'];
  description?: TokenInfo['description'];

  constructor(tokenInfo: TokenInfo) {
    this.name = tokenInfo.name;
    this.isCore = tokenInfo.name.startsWith(CORE_TOKEN_IDENTIFIER);
    this.value = tokenInfo.value;
    this.type = tokenInfo.type;
    this.originalValue = tokenInfo.originalValue;
    this.path = tokenInfo.path;
    this.themeName = this.isCore ? undefined : tokenInfo.path.at(0);
    this.category = tokenInfo.category;
    this.description = tokenInfo.description;
  }

  get isComposite() {
    return this.type === 'composite';
  }

  get cssVar() {
    if (this.isComposite) {
      throw new Error('Cannot get css variable name for composite token');
    }

    return this.isCore
      ? getCssVariableName(this.name)
      : getCssVariableName(
          this.path.filter((p) => p !== this.themeName).join('.')
        );
  }

  get compositeClassName() {
    if (!this.isComposite) {
      throw new Error(
        'Cannot get composite class name for non-composite token'
      );
    }

    return this.isCore
      ? `.${this.name.replace(/\./g, '-')}`
      : `.${this.path.filter((p) => p !== this.themeName).join('-')}`;
  }

  /**
   * Finalizes the token name by removing the theme name if it's not a core value.
   * This method checks if the token is a core value. If it is, it returns the original name.
   * Otherwise, it removes the first part of the token name (which is the theme name) and returns the rest.
   *
   * @returns The finalized token name without the theme name if it's not a core value.
   *
   * @example
   * // Assuming the token name is 'theme.color.primary' and it's not a core value
   * const tokenParser = new TokenParser({
   *   name: 'theme.color.primary',
   *   type: TokenTypes.VALUE,
   *   path: ['theme', 'color', 'primary'],
   *   value: 'someValue',
   *   originalValue: 'someOriginalValue',
   *   category: 'color',
   * });
   * // Returns 'color.primary'
   * tokenParser.finalizedTokenName();
   */
  get finalizedTokenName() {
    // Remove the first part of the token name in case it's not a core value, as it's the theme name
    return this.isCore ? this.name : this.name.split('.').slice(1).join('.');
  }

  /**
   * Replaces all references in the object with css variables
   * ```
   * const modifiedObject = replaceReferences({
   *  token: '{core.color.brand_100}',
   * });
   * // Returns { token: 'var(--core-color-brand-100)' }
   *
   * const modifiedObject = replaceReferences('{core.color.brand_100}')
   * // Returns 'var(--core-color-brand-100)'
   * ```
   */
  get cssVarValue(): DesignTokenValue {
    return transformDesignTokenValueToCss(this.originalValue);
  }
}
