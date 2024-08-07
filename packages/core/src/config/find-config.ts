import findUp from 'escalade/sync';
import { logger } from '../utils';
import { LoadConfigOptions } from './load-config.ts';
import { resolve } from 'path';

const configFiles = new Set(['jux.config.ts', 'jux.config.js']);

export function findConfig(
  options: LoadConfigOptions = {
    cwd: process.cwd(),
  }
) {
  if (options.configFile) {
    logger.verbose(`Using config file ${options.configFile}`);
    return resolve(options.cwd!, options.configFile);
  }

  // It's safe to cast the cwd to a string here because we're providing a default value
  const configPath = findUp(options.cwd!, (_, paths) =>
    paths.find((file) => configFiles.has(file))
  );

  if (!configPath) {
    logger.warn(`Config file 'jux.config' not found. Please run 'jux init'`);
    return;
  }

  return configPath;
}
