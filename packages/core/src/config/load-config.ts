import { Config } from '@oclif/core';
import { findConfig } from './find-config';
import { bundleRequire } from 'bundle-require';
import { readTSConfig, resolveTSConfig, type TSConfig } from 'pkg-types';
import { logger } from '../utils';
import {
  type APIConfig,
  type JuxCLIConfig,
  type JuxInternalCliConfig,
} from './config.types';
import { validateConfig } from './validate-config';
import { JuxContext } from './jux-context';
import { getCliConfigEnv } from './get-and-verify-internal-config';

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

async function loadConfig(
  options: LoadConfigOptions
): Promise<Pick<LoadConfigRes, 'cliConfig' | 'configPath'>> {
  const configPath = findConfig(options);

  if (!configPath) {
    throw new Error('No config file found. Did you forget to run jux init?');
  }

  logger.debug(`Using config file ${configPath}`);

  const { mod } = await bundleRequire<{
    default: JuxCLIConfig;
  }>({
    filepath: configPath,
  });

  if (!mod.default) {
    throw new Error('Config must export a default object');
  }

  if (typeof mod.default !== 'object') {
    throw new Error('Config must be an object');
  }

  return {
    cliConfig: mod.default,
    configPath,
  };
}

export async function getConfigContext(
  options: LoadConfigOptions,
  oclifConfig?: Config,
  internalConfig?: JuxInternalCliConfig
) {
  const loadConfigRes = await loadConfig(options);

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
