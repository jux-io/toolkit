import { Config } from '@oclif/core';
import { type TSConfig } from 'pkg-types';
import { logger } from '../utils';
import {
  type APIConfig,
  type JuxCLIConfig,
  type JuxInternalCliConfig,
} from './config.types';
import { validateConfig } from './validate-config';
import { JuxContext } from './jux-context';
import { getCliConfigEnv } from './get-and-verify-internal-config';
import { ConfigNotFoundError } from '../utils/exceptions';
import { loadCliConfig } from './load-cli-config.ts';
import { getFullPath } from '../utils';

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

export async function getConfigContext(options: GetConfigContextOptions) {
  const cwd = getFullPath(options.cwd);

  const loadConfigRes = await loadCliConfig({
    ...options,
    cwd,
  });

  if (!loadConfigRes) {
    throw new ConfigNotFoundError(cwd);
  }

  const apiConfig = getCliConfigEnv();

  const result: LoadConfigRes = {
    ...loadConfigRes,
    environmentConfig: options.oclifConfig,
    internalConfig: options.internalConfig,
    apiConfig,
  };

  // Validate config will throw if there are any issues
  validateConfig(result.cliConfig);

  logger.debug(`Using config file ${result.configPath}`);

  return new JuxContext(result);
}
