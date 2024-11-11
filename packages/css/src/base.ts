/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CSS from 'csstype';

declare const emptyObjectSymbol: unique symbol;

/**
 Represents a strictly empty plain object, the `{}` value.

 When you annotate something as the type `{}`, it can be anything except `null` and `undefined`. This means that you cannot use `{}` to represent an empty plain object ([read more](https://stackoverflow.com/questions/47339869/typescript-empty-object-and-any-difference/52193484#52193484)).

 @example
 ```
 import type {EmptyObject} from 'type-fest';

 // The following illustrates the problem with `{}`.
 const foo1: {} = {}; // Pass
 const foo2: {} = []; // Pass
 const foo3: {} = 42; // Pass
 const foo4: {} = {a: 1}; // Pass

 // With `EmptyObject` only the first case is valid.
 const bar1: EmptyObject = {}; // Pass
 const bar2: EmptyObject = 42; // Fail
 const bar3: EmptyObject = []; // Fail
 const bar4: EmptyObject = {a: 1}; // Fail
 ```

 Unfortunately, `Record<string, never>`, `Record<keyof any, never>` and `Record<never, never>` do not work. See {@link https://github.com/sindresorhus/type-fest/issues/395 #395}.

 @category Object
 */
export interface EmptyObject {
  [emptyObjectSymbol]?: never;
}

export type CSSProperties = CSS.PropertiesFallback<number | string>;

export type BaseProps = Record<string, any>;

// Get union of all value arrays in the object
type ValueArrays<T> = T[keyof T];

// Unwrap arrays into union of their elements
type UnwrapArray<T> = T extends readonly (infer U)[] ? U : never;

// Final utility type that returns union of all values
// Add constraint to ensure it works with indexed types
type FlattenArrays<T> = UnwrapArray<ValueArrays<T>> &
  (string | number | symbol);

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
export type Merge<A extends object, B extends object> = FastOmit<A, keyof B> &
  B;

export type ConditionalValue<V> =
  | V
  | (V | null)[]
  | {
      [K in keyof string]?: ConditionalValue<V>;
    };

/**
 * Helper type to safely access nested properties and handle unknown types
 */
type TokenValue<T, K extends keyof T> = K extends keyof T ? T[K] : never;

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
export interface CustomTokensValues<
  Tokens extends Record<string, any> = object,
> {
  color?: TokenValue<Tokens, 'color'> | CSSProperties['color'];
  backgroundColor?:
    | TokenValue<Tokens, 'color'>
    | CSSProperties['backgroundColor'];
  borderColor?: TokenValue<Tokens, 'color'> | CSSProperties['backgroundColor'];
  gap?: TokenValue<Tokens, 'dimension'> | CSSProperties['gap'];
  borderRadius?:
    | TokenValue<Tokens, 'dimension'>
    | CSSProperties['borderRadius'];
  borderWidth?: TokenValue<Tokens, 'dimension'> | CSSProperties['borderWidth'];
  width?: TokenValue<Tokens, 'dimension'> | CSSProperties['width'];
  height?: TokenValue<Tokens, 'dimension'> | CSSProperties['height'];
  fontFamily?: TokenValue<Tokens, 'fontFamily'> | CSSProperties['fontFamily'];
  fontSize?: TokenValue<Tokens, 'dimension'> | CSSProperties['fontSize'];
  lineHeight?: TokenValue<Tokens, 'dimension'> | CSSProperties['lineHeight'];
  padding?: TokenValue<Tokens, 'dimension'> | CSSProperties['padding'];
  paddingTop?: TokenValue<Tokens, 'dimension'> | CSSProperties['paddingTop'];
  paddingRight?:
    | TokenValue<Tokens, 'dimension'>
    | CSSProperties['paddingRight'];
  paddingBottom?:
    | TokenValue<Tokens, 'dimension'>
    | CSSProperties['paddingBottom'];
  paddingLeft?: TokenValue<Tokens, 'dimension'> | CSSProperties['paddingLeft'];
  margin?: TokenValue<Tokens, 'dimension'> | CSSProperties['margin'];
  marginTop?: TokenValue<Tokens, 'dimension'> | CSSProperties['marginTop'];
  marginRight?: TokenValue<Tokens, 'dimension'> | CSSProperties['marginRight'];
  marginBottom?:
    | TokenValue<Tokens, 'dimension'>
    | CSSProperties['marginBottom'];
  marginLeft?: TokenValue<Tokens, 'dimension'> | CSSProperties['marginLeft'];
  fill?: TokenValue<Tokens, 'color'> | CSSProperties['fill'];
  stroke?: TokenValue<Tokens, 'color'> | CSSProperties['stroke'];
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
   * Custom typography tokens as defined in jux config file.
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
  BaseStyles extends CSSProperties = CSSProperties,
  Utilities extends BaseProps = EmptyObject,
  Conditions extends BaseProps = EmptyObject,
> = {
  [K in Prefix<'&', CSS.Pseudos>]?: CSSPropertiesWithCustomValues<
    BaseStyles,
    Utilities,
    Conditions
  >;
} & {
  [K in keyof CSSProperties as K extends keyof Utilities
    ? never
    : K]?: BaseStyles[K];
} & Utilities & {
    [K in FlattenArrays<Conditions>]?: CSSPropertiesWithCustomValues<
      BaseStyles,
      Utilities,
      Conditions
    >;
  } & {
    [K: string]:
      | number
      | string
      | CSSPropertiesWithCustomValues<BaseStyles, Utilities, Conditions>
      | EmptyObject
      | undefined;
  };

export type StyleArguments = {
  [K in keyof CSSProperties]: CSS.Properties[K];
};
