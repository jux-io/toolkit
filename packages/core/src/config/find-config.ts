import findUp from 'escalade/sync';
import { LoadConfigOptions } from './load-config';

const configFiles = new Set(['jux.config.ts', 'jux.config.js']);

export function findConfig(
  options: LoadConfigOptions = {
    cwd: process.cwd(),
  }
) {
  // It's safe to cast the cwd to a string here because we're providing a default value
  return findUp(options.cwd!, (_, paths) =>
    paths.find((file) => configFiles.has(file))
  );
}
