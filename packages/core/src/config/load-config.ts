import { Config } from '@oclif/core';
import { cosmiconfigSync } from 'cosmiconfig';
import { readTSConfig, resolveTSConfig, type TSConfig } from 'pkg-types';
import { z } from 'zod';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
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

export interface LoadConfigRes {
  cliConfig: JuxCLIConfig;
  configPath: string;
  internalConfig?: JuxInternalCliConfig;
  environmentConfig?: Config;
  tsconfig?: {
    content: TSConfig;
    path: string;
  };
  apiConfig: APIConfig;
}

export interface LoadConfigOptions {
  cwd?: string; // The current directory to load the config from
  configFile?: string; // The path to the config file
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
  tsx: z.boolean().default(true),
  components_directory: z.string(),
  tokens_directory: z.string(),
  definitions_directory: z.string(),
  rsc: z.boolean().optional(),
  core_tokens: tokensSchema,
  themes: z.record(z.string(), tokensSchema),
});

export function loadConfig(
  options: LoadConfigOptions,
  withValidation = true
): Pick<LoadConfigRes, 'cliConfig' | 'configPath'> {
  const explorer = cosmiconfigSync('jux', {
    searchPlaces: ['jux.config.ts'],
    loaders: {
      '.ts': TypeScriptLoader(),
    },
  });

  const result = explorer.search(options.cwd);

  if (!result) {
    throw new Error('No config file found. Did you forget to run jux init?');
  }

  logger.debug(`Using config file ${result.filepath}`);

  if (withValidation) {
    if (!result.config) {
      throw new Error('Config must export a default object');
    }

    if (typeof result.config !== 'object') {
      throw new Error('Config must be an object');
    }

    const parseResult = rawConfigSchema.safeParse(result.config);

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
    cliConfig: result.config,
    configPath: result.filepath,
  };
}

export async function getConfigContext(
  options: LoadConfigOptions,
  oclifConfig?: Config,
  internalConfig?: JuxInternalCliConfig
) {
  const loadConfigRes = loadConfig(options);

  const apiConfig = getCliConfigEnv();

  const result: LoadConfigRes = {
    ...loadConfigRes,
    environmentConfig: oclifConfig,
    internalConfig,
    tsconfig: {
      content: await readTSConfig(options.cwd),
      path: await resolveTSConfig(options.cwd),
    },
    apiConfig,
  };

  // Validate config will throw if there are any issues
  validateConfig(result.cliConfig);

  return new JuxContext(result);
}
