// Token types
export enum DesignTokenTypeEnum {
  // this is a string enum - keys must equal values
  color = 'color',
  dimension = 'dimension',
  fontFamily = 'fontFamily',
  fontWeight = 'fontWeight',
  duration = 'duration',
  cubicBezier = 'cubicBezier',
  number = 'number',
  strokeStyle = 'strokeStyle',
  border = 'border',
  transition = 'transition',
  shadow = 'shadow',
  gradient = 'gradient',
  typography = 'typography',
  fontStyle = 'fontStyle',
  textDecoration = 'textDecoration',
}

// this is so that we can do either of the following:
// 1. `token.type = DesignTokenTypeEnum.color`
// 2. `token.type = 'color'`
export type DesignTokenType = keyof typeof DesignTokenTypeEnum;

// Token value types
export type DesignTokenPrimitive = string | number | boolean | undefined;
export type DesignTokenComposite = Record<string, DesignTokenPrimitive>;
export type DesignTokenValue = DesignTokenComposite | DesignTokenPrimitive;
export interface DesignTokensExtensions {
  createdAt?: string;
  isLocked?: boolean;
}

// Token interface
export interface DesignToken {
  $value?: DesignTokenValue;
  $type?: DesignTokenType;
  $description?: string;
  $extensions?: DesignTokensExtensions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Group of tokens
export interface DesignTokens {
  [key: string]: DesignTokens | DesignToken;
}
