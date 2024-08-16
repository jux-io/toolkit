import { z } from 'zod';
import { internalConfigSchema } from './get-and-verify-internal-config';
import { type DesignToken, DesignTokenTypeEnum } from '@juxio/design-tokens';
import { GoogleFont } from './builtin-fonts.ts';
import * as CSS from 'csstype';

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

export type Recursive<T> = {
  [key: string]: T | Recursive<T>;
} & {
  $description?: string;
};

export type TokenValue = Pick<DesignToken, '$value' | '$description'> | string;

export interface Tokens {
  [DesignTokenTypeEnum.color]?: Recursive<TokenValue>;
  [DesignTokenTypeEnum.dimension]?: Recursive<TokenValue>;
  [DesignTokenTypeEnum.typography]?: Recursive<TokenValue>;
  [DesignTokenTypeEnum.border]?: Recursive<TokenValue>;
  [DesignTokenTypeEnum.fontFamily]?: Recursive<TokenValue>;
  $description?: string;
}

export interface BuiltInFonts {
  google: GoogleFont['family'][];
}

export type GlobalCssStyles = Record<string, CSS.Properties>;

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
   * Global CSS styles to apply
   */
  globalCss?: GlobalCssStyles;

  /**
   * Built in fonts to use. Currently only supports Google Fonts
   */
  builtInFonts?: BuiltInFonts;

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
