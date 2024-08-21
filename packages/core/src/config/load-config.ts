import { Config } from '@oclif/core';
import { bundleRequire } from 'bundle-require';
import { type TSConfig } from 'pkg-types';
// @ts-expect-error load-tsconfig is not typed
import { loadTsConfig } from 'load-tsconfig';
import { z } from 'zod';
import { colorScheme, logger } from '../utils';
import {
  type APIConfig,
  type JuxCLIConfig,
  type JuxInternalCliConfig,
} from './config.types';
import { validateConfig } from './validate-config';
import { JuxContext } from './jux-context';
import { getCliConfigEnv } from './get-and-verify-internal-config';
import { DesignTokenTypeEnum } from '@juxio/design-tokens';
import { findConfig } from './find-config';
import { ConfigNotFoundError } from '../utils/exceptions';

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

export interface LoadConfigOptions {
  cwd?: string; // The current directory to load the config from
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
  definitions_directory: z.string(),
  rsc: z.boolean().optional(),
  core_tokens: tokensSchema,
  themes: z.record(z.string(), tokensSchema),
});

export async function loadConfig(
  options: LoadConfigOptions,
  withValidation = true
): Promise<Pick<LoadConfigRes, 'cliConfig' | 'configPath'> | undefined> {
  const configPath = findConfig(options);

  if (!configPath) {
    return;
  }

  const { mod } = await bundleRequire<{
    default: JuxCLIConfig;
  }>({
    filepath: configPath,
  });

  if (withValidation) {
    if (!mod.default) {
      throw new Error('Config must export a default object');
    }

    if (typeof mod.default !== 'object') {
      throw new Error('Config must be an object');
    }

    const parseResult = rawConfigSchema.safeParse(mod.default);

    if (!parseResult.success) {
      parseResult.error.errors.forEach((error) => {
        logger.error(
          `Config error in ${colorScheme.debug(error.path.join('.'))}: ${error.message}`
        );
      });

      throw new Error('Invalid config file');
    }
  }

  return {
    cliConfig: mod.default,
    configPath,
  };
}

export async function getConfigContext(
  options: LoadConfigOptions = { cwd: process.cwd() },
  oclifConfig?: Config,
  internalConfig?: JuxInternalCliConfig
) {
  const loadConfigRes = await loadConfig(options);

  if (!loadConfigRes) {
    throw new ConfigNotFoundError(options.cwd!);
  }

  const apiConfig = getCliConfigEnv();

  const tsConfigRes: LoadTsConfigRes | null = loadTsConfig(
    options.cwd,
    loadConfigRes.cliConfig.tsconfig ?? 'tsconfig.json'
  );

  const result: LoadConfigRes = {
    ...loadConfigRes,
    environmentConfig: oclifConfig,
    internalConfig,
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
