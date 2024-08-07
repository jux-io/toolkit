import fs from 'fs-extra';
import path from 'path';
import { type APIConfig, type JuxInternalCliConfig } from './config.types';
import { z } from 'zod';
import { FileManager } from '../fs';

export const CONFIG_FILE = 'config.json';

export const internalConfigSchema = z
  .object({
    tokens: z.object({
      access_token: z.string().min(1),
      refresh_token: z.string(),
      expires_at: z.number(),
    }),
    organizationId: z.number().nullish(),
  })
  .strict();

const DEFAULT_CONFIG: JuxInternalCliConfig = {
  tokens: {
    access_token: '',
    refresh_token: '',
    expires_at: 0,
  },
  organizationId: 0,
};

export function getCliConfigEnv(): APIConfig {
  return {
    API_SERVER: process.env.API_SERVER || '',
    CLIENT_ID: process.env.CLIENT_ID || '',
    AUTH_DOMAIN: process.env.AUTH_DOMAIN || '',
    API_AUDIENCE: process.env.API_AUDIENCE || '',
  };
}

export function createInternalConfig(
  configDir: string,
  config: JuxInternalCliConfig = DEFAULT_CONFIG
) {
  const fs = new FileManager();
  fs.writeFile(configDir, CONFIG_FILE, JSON.stringify(config, null, 2));

  return DEFAULT_CONFIG;
}

export function getInternalConfig(configDirPath: string): JuxInternalCliConfig {
  const configPath = path.join(configDirPath, CONFIG_FILE);
  try {
    const config = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(config);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Login configurations not found. Please run 'jux login'`);
    }
    throw error;
  }
}

export function getAndVerifyInternalConfig(
  configDirPath: string
): JuxInternalCliConfig {
  const internalConfig = getInternalConfig(configDirPath);

  try {
    return internalConfigSchema.parse(internalConfig);
  } catch (error) {
    throw new Error(`Invalid login configurations.`);
  }
}
