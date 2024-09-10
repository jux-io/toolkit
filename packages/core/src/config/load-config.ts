import { Config } from '@oclif/core';
import { type TSConfig } from 'pkg-types';
// @ts-expect-error load-tsconfig is not typed
import { loadTsConfig } from 'load-tsconfig';
import { z } from 'zod';
import { logger } from '../utils';
import {
  type APIConfig,
  type JuxCLIConfig,
  type JuxInternalCliConfig,
} from './config.types';
import { validateConfig } from './validate-config';
import { JuxContext } from './jux-context';
import { getCliConfigEnv } from './get-and-verify-internal-config';
import { DesignTokenTypeEnum } from '@juxio/design-tokens';
import { ConfigNotFoundError } from '../utils/exceptions';
import { loadCliConfig } from './load-cli-config.ts';

export interface LoadConfigRes {
  cliConfig: JuxCLIConfig;
  configPath: string;
  internalConfig?: JuxInternalCliConfig;
  environmentConfig?: Config;
  tsconfig?: {
    data: TSConfig;
    path: string;
  };
  apiConfig: APIConfig;
}

export interface GetConfigContextOptions {
  cwd: string; // The current directory to load the config from
  cliConfig?: JuxCLIConfig; // The CLI config object
  oclifConfig?: Config; // The oclif config object
  internalConfig?: JuxInternalCliConfig; // The internal config object (authentication info, in case context should communicate with Jux APIs)
}

export interface LoadTsConfigRes {
  path: string;
  data: TSConfig;
}

export const tokensSchema = z.object({
  ...Object.values(DesignTokenTypeEnum).reduce(
    (acc, curr) => {
      acc[curr] = z.object({}).passthrough().optional();
      return acc;
    },
    {} as Record<string, z.ZodType>
  ),
  $description: z.string().optional(),
});

export const rawConfigSchema = z.object({
  preflight: z.boolean().optional().default(true),
  globalCss: z.record(z.string(), z.any()).optional(),
  builtInFonts: z
    .object({
      google: z.array(z.string()),
    })
    .optional(),
  cssVarsRoot: z.string().optional(),
  include: z.array(z.string()),
  exclude: z.array(z.string()).optional(),
  components_directory: z.string().optional(),
  tokens_directory: z.string().optional(),
  definitions_directory: z.string().optional(),
  core_tokens: tokensSchema,
  themes: z.record(z.string(), tokensSchema),
});

export async function getConfigContext(options: GetConfigContextOptions) {
  const tsConfigRes: LoadTsConfigRes | null = loadTsConfig(options.cwd);

  const loadConfigRes = await loadCliConfig({
    ...options,
    tsConfig: tsConfigRes?.data,
  });

  if (!loadConfigRes) {
    throw new ConfigNotFoundError(options.cwd!);
  }

  const apiConfig = getCliConfigEnv();

  const result: LoadConfigRes = {
    ...loadConfigRes,
    environmentConfig: options.oclifConfig,
    internalConfig: options.internalConfig,
    tsconfig: tsConfigRes
      ? {
          data: tsConfigRes.data,
          path: tsConfigRes.path,
        }
      : undefined,
    apiConfig,
  };

  // Validate config will throw if there are any issues
  validateConfig(result.cliConfig);

  logger.debug(`Using config file ${result.configPath}`);

  return new JuxContext(result);
}
