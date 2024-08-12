/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CSS from 'csstype';

export type CSSProperties = CSS.PropertiesFallback<number | string>;

export type BaseProps = Record<string, any>;

/**
 * Represents a type that omits properties of type `U` from type `T`.
 *
 * @typeParam T - An object type whose properties might be omitted.
 * @typeParam U - A union of keys to omit from `T`.
 * @returns The resulting type after omitting properties of type `U` from `T`.
 */
type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};

/**
 * Represents a type that substitutes properties from type `B` into type `A`.
 * This is useful for creating types that need to replace or extend properties of another type.
 *
 * @typeParam A - An object type whose properties might be partially replaced by `B`.
 * @typeParam B - An object type whose properties will replace or extend those of `A`.
 */
export type MergeWithOverrides<A extends object, B extends object> = FastOmit<
  A,
  keyof B
> &
  B;

/**
 * This allows us to add typing and auto-completion to css properties
 *
 * ```
 * const JuxStyled = styled('button')({
 *   root: {
 *     color: '{core.color.brand_100}',
 *     backgroundColor: '{core.color.brand_200}'
 *   },
 * });
 * ```
 */
export interface CustomTokensValues<Tokens extends BaseProps>
  extends CSSProperties {
  color?: Tokens['color'];
  backgroundColor?: Tokens['color'];
  borderRadius?: Tokens['dimension'];
  borderWidth?: Tokens['dimension'];
  width?: Tokens['dimension'];
  height?: Tokens['dimension'];
  fontFamily?: Tokens['fontFamily'];
  fontSize?: Tokens['dimension'];
  lineHeight?: Tokens['dimension'];
  padding?: Tokens['dimension'];
  paddingTop?: Tokens['dimension'];
  paddingRight?: Tokens['dimension'];
  paddingBottom?: Tokens['dimension'];
  paddingLeft?: Tokens['dimension'];
  margin?: Tokens['dimension'];
  marginTop?: Tokens['dimension'];
  marginRight?: Tokens['dimension'];
  marginBottom?: Tokens['dimension'];
  marginLeft?: Tokens['dimension'];
}

/**
 * This allows us to add typing and auto-completion to custom types that are not part of CSSProperties
 *
 * ```
 * const JuxStyled = styled('button')({
 *   root: {
 *     typography: '{core.typography.body}',
 *   },
 * });
 * ```
 */
export interface CustomTypes<Tokens extends BaseProps> {
  /**
   * Custom typography tokens as defined in config file.
   *
   * ```
   * const juxStyles = css({ typography: '{typography.body}' });
   * ```
   */
  typography?: Tokens['typography'];
}

/**
 * Constructs a type by prefixing a given string `K` to each member of a union type `T`.
 * This utility type is useful for creating string types that are prefixed with a specific
 * string, which can be particularly handy in scenarios such as generating class names
 * dynamically, or creating type-safe identifiers.
 *
 * @typeParam K - The string to prefix.
 * @typeParam T - The union type whose members will be prefixed with `K`. Only `boolean`, `number`,
 *                or `string` types are extracted and used for prefixing.
 * @returns A string type representing the prefixed union members.
 */
export type Prefix<
  K extends string,
  T,
> = `${K}${Extract<T, boolean | number | string>}`;

/**
 * Represents a type that extends CSS properties with custom values and functions.
 * This type is useful for defining CSS properties that can accept custom token values and
 * standard CSS properties.
 *
 * @returns A type that includes CSS properties with custom values, pseudo-classes, and additional custom types.
 */
export type CSSPropertiesWithCustomValues<
  Props extends BaseProps = object,
  CustomTokensValues extends CSSProperties = object,
  CustomTypes = object,
> = {
  [K in keyof CSSProperties]: CustomTokensValues[K] | CSS.Properties[K];
} & {
  [K in Prefix<'&', CSS.Pseudos>]?: CSSPropertiesWithCustomValues<
    Props,
    CustomTokensValues,
    CustomTypes
  >;
} & CustomTypes & {
    [K: string]:
      | number
      | string
      | CSSPropertiesWithCustomValues<Props, CustomTokensValues, CustomTypes>
      | undefined;
  };
