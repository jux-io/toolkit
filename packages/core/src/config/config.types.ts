import { z } from 'zod';
import { internalConfigSchema } from './get-and-verify-internal-config';
import {
  type DesignToken,
  DesignTokenType,
  DesignTokenValue,
} from '@juxio/design-tokens';
import { GoogleFont } from './builtin-fonts';
import { TokenParser, TokensManager } from '../tokens';
import { CSSObject } from './plain-css-types.ts';

export interface UserTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export type JuxInternalCliConfig = z.infer<typeof internalConfigSchema>;

export interface Recursive<T> {
  [key: string]: T | Recursive<T>;
}

export type TokenValue =
  | Pick<DesignToken, '$value' | '$description'>
  | DesignTokenValue;

export type MappedTokenTypes = {
  [key in DesignTokenType]?: Recursive<TokenValue>;
};

export interface Tokens extends MappedTokenTypes {
  $description?: string;
}

export interface BuiltInFonts {
  google: GoogleFont['family'][];
}

export type GlobalCssStyles = Record<string, CSSObject>;

export interface APIConfig {
  API_SERVER: string;
  CLIENT_ID: string;
  AUTH_DOMAIN: string;
  API_AUDIENCE: string;
}

export type Themes = Record<string, Tokens>;

export interface UtilitiesConfig {
  acceptedValues?: string[] | { category: DesignTokenType };
  transform: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    args: {
      tokensManager: TokensManager;
      tokens: TokenParser[];
      rawValue: DesignTokenValue;
    }
  ) => CSSObject | undefined;
}

export type Utilities = Record<string, UtilitiesConfig>;

export type Screen =
  | { raw: string }
  | { min: string }
  | { max: string }
  | { min: string; max: string };

export interface PresetConfig {
  /**
   * Global CSS styles to apply
   */
  globalCss?: GlobalCssStyles;

  /**
   * An object of breakpoints to use
   */
  screens?: Record<string, string | Screen>;

  /**
   * Utilities to use as custom CSS properties
   */
  utilities?: Utilities;

  /**
   * Built in fonts to use. Currently only supports Google Fonts
   */
  builtInFonts?: BuiltInFonts;

  /** The core tokens for the design system */
  core_tokens?: Tokens;

  /** The themes for the design system */
  themes?: Themes;
}

export interface JuxCLIConfig extends PresetConfig {
  /**
   * Whether to apply preflight styles
   * @default true
   */
  preflight?: boolean;

  /**
   * Used to create config presets to be shared across projects
   */
  presets?: PresetConfig[];

  /**
   * The root pseudo class to apply CSS variables to
   */
  cssVarsRoot?: string;

  /** List of glob file patterns to watch for changes
   * ```
   * include: ["./src/**\/*.{js,jsx,ts,tsx}"],
   * ```
   * */
  include?: string[];

  /** List of glob file patterns to exclude from watch changes
   * ```
   * exclude: ['./src/components/jux/not_for_watch_page.tsx']
   * ```
   * */
  exclude?: string[];

  /** Where to pull generated components */
  components_directory?: string;

  /** Where to pull design tokens */
  tokens_directory?: string;

  /** Where to generate functions and type definitions */
  definitions_directory?: string;

  /** An array of browserslist targets */
  browserslist?: string[];
}
