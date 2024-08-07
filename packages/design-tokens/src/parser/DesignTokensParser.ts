import { flatten } from 'flat';
import { get } from 'lodash';
import {
  DesignToken,
  DesignTokenPrimitive,
  DesignTokens,
  DesignTokensValidators,
  DesignTokenValue,
  ParsedTokenSet,
} from '../types';
import {
  deleteByPath,
  getByPath,
  renameToken,
  setGroup,
  setToken,
} from './api';
import { isCompositeToken } from './helpers';
import {
  getAliasMatches,
  isAlias,
  validateAliasTokenValue,
  validateBorderTokenValue,
  validateColorTokenValue,
  validateDimensionTokenValue,
  validateFontFamilyTokenValue,
  validateGroupName,
  validateTokenName,
  validateTypographyTokenValue,
} from './validations';

const getValidators = () =>
  ({
    validateGroupName,
    validateTokenName,
    validateAliasTokenValue,
    valueByType: {
      color: validateColorTokenValue,
      dimension: validateDimensionTokenValue,
      fontFamily: validateFontFamilyTokenValue,
      typography: validateTypographyTokenValue,
      border: validateBorderTokenValue,
    },
  }) as const;

interface DesignTokensParserHooks {
  onChange?: (parser: DesignTokensParser) => void;
}

export class DesignTokensParser {
  // TODO: Make this readonly as well
  private _raw: DesignTokens;
  private _rawValuesMap = new Map<string, DesignTokenValue>();
  private _hooks: DesignTokensParserHooks;
  private readonly _parsed: ParsedTokenSet;
  private readonly _validators: DesignTokensValidators;

  constructor(tokens: DesignTokens, hooks: DesignTokensParserHooks = {}) {
    this._validators = getValidators();
    this._parsed = {
      valuesMap: new Map(),
      aliasesMap: new Map(),
    };
    this._hooks = hooks;
    this._raw = structuredClone(tokens);
    this._parseRawTokens();
  }

  /**
   * @private
   * @description Recursively get the actual value of an alias token
   * @description Used to replace aliases with actual values in {@link ParsedTokenSet.valuesMap}
   * @param alias alias token to resolve, e.g. "{color.default.primary}"
   * @param foundPaths used to detect circular references
   * @returns Resolved value of the alias
   * @throws Error if the alias is invalid or if a circular reference is detected
   */
  private _resolveAliasValue(
    alias: string,
    foundPaths = new Set<string>()
  ): DesignTokenValue {
    if (!isAlias(alias)) {
      throw new Error(`"${alias}" is not an alias`);
    }

    const { valuePath } = getAliasMatches(alias);

    if (foundPaths.has(valuePath)) {
      throw new Error(
        `Circular reference detected. Found paths: ${[
          ...foundPaths,
          valuePath,
        ].join(' -> ')}`
      );
    }

    foundPaths.add(valuePath);

    const token = getByPath({
      tokenOrGroupPath: valuePath,
      tokenSet: this._raw,
    }) as DesignToken;

    if (!token) {
      // TODO: Add tests for such edge cases
      // TODO: should we throw an error here or just return the alias?
      // This should only happen when the token set has invalid aliases
      throw new Error(`Missing token at path "${valuePath}"`);
    }

    // If the value is an object, we need to resolve aliases in its props
    if (isCompositeToken(token.$value)) {
      const resolved = structuredClone(token.$value);
      for (const [key, value] of Object.entries(resolved)) {
        if (typeof value === 'string' && isAlias(value)) {
          resolved[key] = this._resolveAliasValue(
            value,
            foundPaths
          ) as DesignTokenPrimitive;
        }
      }
      return resolved;
    }
    // Otherwise, if the value is an alias string, we need to check if it's an alias
    else if (isAlias(token.$value)) {
      return this._resolveAliasValue(token.$value, foundPaths);
    }

    // Otherwise, we can just return the value
    return token.$value;
  }

  /**
   * @private
   * @description Used when parsing a raw token set
   * @description Mutates the {@link ParsedTokenSet.valuesMap}
   *  by replacing aliases with their actual values.
   * @description Populates the {@link ParsedTokenSet.aliasesMap}
   *  with the aliases found in the token set, and the paths that reference them.
   * @description This is an initial implementation that only supports one level of nesting.
   * @description TODO: Support more than one level of nesting
   */
  private _populateAliases() {
    const { valuesMap } = this._parsed;
    for (const [key, value] of valuesMap) {
      if (typeof value === 'string') {
        if (isAlias(value)) {
          let resolved = this._resolveAliasValue(value);
          if (Array.isArray(resolved)) {
            // If the value is an array, join it into a string
            // TODO: Add tests for this
            resolved = resolved.join(', ');
          }
          valuesMap.set(key, resolved);
          this._updateAliasesMap(value, `${key}.$value`);
        }
      } else if (isCompositeToken(value)) {
        // iterate over the object and replace any aliases with their actual values
        for (const [subKey, subValue] of Object.entries(value)) {
          if (isAlias(subValue)) {
            let resolved = this._resolveAliasValue(subValue);
            // currently we only support one level of nesting
            if (!isCompositeToken(resolved)) {
              if (Array.isArray(resolved)) {
                // If the value is an array, join it into a string
                // TODO: Add tests for this
                resolved = resolved.join(', ');
              }
              value[subKey] = resolved;
              this._updateAliasesMap(subValue, `${key}.$value.${subKey}`);
            }
          }
        }
      }
    }
  }

  /**
   * @private
   * @description Method for updating the {@link ParsedTokenSet.aliasesMap}.
   */
  private _updateAliasesMap(alias: string, affectedPath: string) {
    const { valuePath } = getAliasMatches(alias);
    const { aliasesMap } = this._parsed;
    if (aliasesMap.has(valuePath)) {
      aliasesMap.get(valuePath)?.add(affectedPath);
    } else {
      aliasesMap.set(valuePath, new Set([affectedPath]));
    }
  }

  /**
   * @private
   * @description Parses the raw tokens into a {@link ParsedTokenSet}.
   */
  private _parseRawTokens() {
    const flatTokens = flatten<DesignTokens, Record<string, DesignTokenValue>>(
      this._raw,
      // Using `safe: true` to preserve arrays and their contents https://github.com/hughsk/flat#safe
      { safe: true }
    );

    const { valuesMap, aliasesMap } = this._parsed;
    valuesMap.clear();
    aliasesMap.clear();

    Object.entries(flatTokens).forEach(([key, value]) => {
      const endsWithValueRegex = /\.\$value$/;
      const containsValueRegex = /\.\$value\.(.+)$/;
      // capture and transform any alias that ends with `.$value`
      if (endsWithValueRegex.test(key)) {
        if (Array.isArray(value)) {
          // If the value is an array, join it into a string
          // TODO: Add tests for this
          value = value.join(', ');
        }
        const newKey = key.replace(endsWithValueRegex, '');
        valuesMap.set(newKey, value);
        this._rawValuesMap.set(newKey, value);
      }
      // Since flatten() doesn't skip composite token $value objects, we need to recreate them.
      // So here we capture and transform any entry like:
      // `some.$value.property: "foo"` -> `some.$value: { property: "foo" }`.
      // This is a temporary solution until we find a better way to flatten objects.
      else if (containsValueRegex.test(key)) {
        const newKey = key.replace(containsValueRegex, '');
        const newValue = valuesMap.get(newKey) || {};
        if (
          isCompositeToken(newValue) &&
          Object.prototype.toString.call(value) !== '[object Object]'
        ) {
          const match = key.match(containsValueRegex);
          if (match) {
            if (Array.isArray(value)) {
              // If the value is an array, join it into a string
              // TODO: Add tests for this
              value = value.join(', ');
            }
            const [, property] = match;
            this._rawValuesMap.set(newKey, {
              ...newValue,
              [property]: value as DesignTokenPrimitive,
            });

            valuesMap.set(newKey, {
              ...newValue,
              [property]: value as DesignTokenPrimitive,
            });
          }
        }
      }
    });

    this._populateAliases();
  }

  /**
   * @public
   * @description Takes a raw tokens object and parses it
   */
  parse(tokens: DesignTokens): DesignTokensParser {
    this._raw = structuredClone(tokens);
    this._parseRawTokens();
    return this;
  }

  /**
   * @public
   * @description Returns the parsed token by path.
   *  All nested aliases are fully resolved recursively.
   */
  getValue(path: string): DesignTokenValue | undefined {
    return this._parsed.valuesMap.get(path);
  }

  /**
   * @public
   * @description Returns the raw token by path.
   * @description When recursive is true, it will also resolve aliases,
   *  but unlike {@link getValue}, this method doesn't resolve
   *  aliases that are nested inside composite values.
   */
  getTokenRawValue(path: string, recursive?: boolean): DesignTokenValue {
    const getRawValue = (p: string) =>
      get(this._raw, p)?.$value as DesignTokenValue;

    let currentPath = path;
    let result;

    while (currentPath) {
      result = getRawValue(currentPath);
      if (recursive && isAlias(result)) {
        currentPath = getAliasMatches(result).valuePath;
      } else {
        currentPath = '';
      }
    }

    return result;
  }

  /**
   * @public
   * @description Returns true if a token exists for the given path.
   */
  has(path: string): boolean {
    return this._parsed.valuesMap.has(path);
  }

  /**
   * @public
   * @description Returns an object containing all the parsed tokens
   *  that exist in the {@link ParsedTokenSet.valuesMap}.
   */
  getValuesMap(): Record<string, DesignTokenValue> {
    return Object.fromEntries(this._parsed.valuesMap.entries());
  }

  /**
   * @public
   * @description Returns an object containing all the raw tokens
   *  that exist in the {@link ParsedTokenSet.valuesMap}.
   */
  getRawValuesMap(): Record<string, DesignTokenValue> {
    return Object.fromEntries(this._rawValuesMap.entries());
  }

  /**
   * @public
   * @description Returns an object containing aliases and their affected paths.
   * @example { 'alias.path': ['affected.path.1', 'affected.path.2'] }
   */
  getAliasesMap(): Record<string, string[]> {
    return Object.fromEntries(
      Array.from(this._parsed.aliasesMap.entries()).map(
        ([tokenPath, aliases]) => [
          tokenPath,
          Array.from(aliases).map((alias) => alias.replace(/\.\$value$/, '')),
        ]
      )
    );
  }

  /**
   * @public
   * @description Inserts or updates a token.
   */
  setToken({
    allowOverwrite,
    tokenData,
    tokenPath,
  }: {
    tokenData: DesignToken;
    tokenPath: string;
    allowOverwrite?: boolean;
  }): DesignTokensParser {
    this.parse(
      setToken({
        tokenPath,
        allowOverwrite,
        tokenData,
        tokenSet: this._raw,
        parsedTokenSet: this._parsed,
        validators: this._validators,
      })
    );
    this._hooks.onChange?.(this);
    return this;
  }

  // rename token

  /**
   * @public
   * @description Renames a token.
   * @throws If a token doesn't exist or if there's no group at the oldPath.
   * @throws If a token already exists at the newPath.
   */
  renameToken({
    oldPath,
    newPath,
  }: {
    oldPath: string;
    newPath: string;
  }): DesignTokensParser {
    this.parse(
      renameToken({
        oldPath,
        newPath,
        tokenSet: this._raw,
        aliasesMap: this._parsed.aliasesMap,
        validators: this._validators,
      })
    );
    this._hooks.onChange?.(this);
    return this;
  }

  /**
   * @public
   * @description Inserts or updates a group.
   * @description If the group doesn't exist at the groupPath, it will be created.
   * @description If the group doesn't exist and the groupPath is not provided,
   *  it will be created at the root level.
   * @description If the group already exists at the groupPath, and allowOverwrite
   *  is true, it will be overwritten.
   * @description If oldName is provided, the group will be renamed and updated.
   * @throws If the group already exists at the groupPath, and allowOverwrite is false.
   * @throws If the group already exists at the groupPath, and oldName is not provided.
   * @throws If oldName is provided, and the group doesn't exist.
   * @throws If there is no group object at the groupPath.
   */
  setGroup({
    allowOverwrite,
    groupName,
    description,
    groupPath,
    oldName,
  }: {
    groupName: string;
    allowOverwrite?: boolean;
    description?: string;
    groupPath?: string;
    oldName?: string;
  }): DesignTokensParser {
    this.parse(
      setGroup({
        allowOverwrite,
        description,
        groupName,
        groupPath,
        oldName,
        tokenSet: this._raw,
        validators: this._validators,
        aliasesMap: this._parsed.aliasesMap,
      })
    );
    this._hooks.onChange?.(this);
    return this;
  }

  /**
   * @public
   * @description Deletes a group or token at the given path.
   * @description If the path is a group, all nested tokens will be deleted.
   * @throws If the path is a token that has aliases.
   */
  deleteByPath(path: string): DesignTokensParser {
    this.parse(
      deleteByPath({
        path,
        tokenSet: this._raw,
        aliasesMap: this._parsed.aliasesMap,
      })
    );
    this._hooks.onChange?.(this);
    return this;
  }

  /**
   * @public
   * @description Returns a copy of the raw (unparsed) tokens object.
   */
  getRawValueCopy() {
    return structuredClone(this._raw);
  }
}
