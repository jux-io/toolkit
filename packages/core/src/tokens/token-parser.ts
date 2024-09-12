import { CORE, type DesignTokenValue } from '@juxio/design-tokens';
import { type Tokens } from '../config';
import { getCssVariableName } from './get-css-variable-name';
import { transformDesignTokenValueToCss } from './transform-design-token-value-to-css';
import { underscore } from '../utils';

export interface TokenInfo {
  name: string;
  type: TokenTypes;
  path: string[];
  value: DesignTokenValue;
  /* The calculated value of this token, in case of semantic token */
  rawValue: DesignTokenValue;
  category: keyof Tokens | undefined | null;
  description?: string;
}

export enum TokenTypes {
  VALUE = 'value',
  COMPOSITE = 'composite',
}

export const CORE_TOKEN_IDENTIFIER = CORE;

export class TokenParser {
  /**
   * The original name of the token
   */
  name: TokenInfo['name'];

  /**
   * The formatted name of the token (underscored)
   */
  formattedName: TokenInfo['name'];

  /**
   * The type of the token (value or composite)
   */
  type: TokenTypes;

  /**
   * Whether the token is a core token
   */
  isCore: boolean;

  /**
   * The theme name this token belongs to
   */
  themeName?: string;

  /**
   * The value of the token (the final value that will be used in the CSS)
   */
  value: TokenInfo['value'];

  /**
   * The raw value of the token (the original value from the design tokens)
   */
  rawValue: TokenInfo['rawValue'];

  /**
   * CSS variable name for the token. Undefined if the token is a composite token.
   *
   * @throws {Error} If the token is a composite token.
   * @returns {string} The CSS variable name.
   */
  cssVar: string;

  path: TokenInfo['path'];
  category: TokenInfo['category'];
  description?: TokenInfo['description'];

  constructor(tokenInfo: TokenInfo) {
    this.name = tokenInfo.name;
    this.formattedName = underscore(tokenInfo.name);
    this.isCore = tokenInfo.name.startsWith(CORE_TOKEN_IDENTIFIER);
    this.type = tokenInfo.type;
    this.rawValue = tokenInfo.rawValue;
    this.value = transformDesignTokenValueToCss(tokenInfo.rawValue);
    this.path = tokenInfo.path;
    this.themeName = this.isCore ? undefined : tokenInfo.path.at(0);
    this.cssVar = this.isComposite ? '' : this.cssVariable;
    this.category = tokenInfo.category;
    this.description = tokenInfo.description;
  }

  get isComposite() {
    return this.type === 'composite';
  }

  /**
   * Gets the CSS variable name for the token.
   *
   * @throws {Error} If the token is a composite token.
   * @returns {string} The CSS variable name.
   */
  get cssVariable(): string {
    if (this.isComposite) {
      throw new Error('Cannot get css variable name for composite token');
    }

    return this.isCore
      ? getCssVariableName(this.formattedName)
      : getCssVariableName(
          this.path.filter((p) => p !== this.themeName).join('.')
        );
  }

  /**
   * Finalizes the token name by removing the theme name if it's not a core value.
   * This method checks if the token is a core value. If it is, it returns the original name.
   * Otherwise, it removes the first part of the token name (which is the theme name) and returns the rest.
   *
   * @returns The finalized token name without the theme name if it's not a core value.
   *
   * @example
   * // Assuming the token name is 'theme.color.primary' and it's not a core token value
   * const tokenParser = new TokenParser({
   *   name: 'theme.color.primary',
   *   type: TokenTypes.VALUE,
   *   path: ['theme', 'color', 'primary'],
   *   value: 'someValue',
   *   rawValue: 'someOriginalValue',
   *   category: 'color',
   * });
   * // Returns 'color.primary'
   * tokenParser.finalizedTokenName();
   */
  get finalizedTokenName() {
    // Remove the first part of the token name in case it's not a core value, as it's the theme name
    return this.isCore ? this.name : this.name.split('.').slice(1).join('.');
  }
}
