import { z } from 'zod';
import { internalConfigSchema } from './get-and-verify-internal-config';
import {
  type DesignToken,
  DesignTokenTypeEnum,
  type TypographyTokenValue,
} from '@juxio/design-tokens';

export interface UserTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export type JuxInternalCliConfig = z.infer<typeof internalConfigSchema>;

export interface JuxCliConfigOptions {
  tsx: boolean;
  styled_option: string;
  components_directory: string;
  tokens_directory: string;
  rsc: boolean;
}

export interface Recursive<T> {
  [key: string]: T | Recursive<T>;
}

export type TokenValue = Pick<DesignToken, '$value' | '$description'>;
export type CompositieTokenValue = TypographyTokenValue;

export interface Tokens {
  [DesignTokenTypeEnum.color]?: Recursive<TokenValue>;
  [DesignTokenTypeEnum.dimension]?: Recursive<TokenValue>;
  [DesignTokenTypeEnum.typography]?: Recursive<TokenValue>;
}

export interface Theme {
  /**
   * The core tokens for the theme
   */
  tokens: Tokens;
}

export interface APIConfig {
  API_SERVER: string;
  CLIENT_ID: string;
  AUTH_DOMAIN: string;
  API_AUDIENCE: string;
}

export type Themes = Record<string, Tokens>;

export interface JuxCLIConfig {
  /**
   * Whether to apply preflight styles
   * @default true
   */
  preflight?: boolean;

  /**
   * The root pseudo class to apply CSS variables to
   */
  cssVarsRoot?: string;

  /** List of glob file patterns to watch for changes */
  include: string[];

  /** List of glob file patterns to exclude from watch changes */
  exclude?: string[];

  /**
   * Whether to pull components in tsx / jsx
   * @default true
   * */
  tsx: boolean;

  /** The styled option to use */
  styled_option: 'styled';

  /** Where to pull generated components */
  components_directory: string;

  /** Where to pull design tokens */
  tokens_directory: string;

  /** Where to generate functions and type definitions */
  definitions_directory: string;

  /** Whether to use rsc in pulled components */
  rsc: boolean;

  /** The core tokens for the design system */
  core_tokens: Tokens;

  /** The themes for the design system */
  themes: Themes;
}
