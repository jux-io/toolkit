import * as path from 'path';

/**
 * Resolves the full path of the given input path.
 *
 * @param {string} inputPath - The input path to resolve.
 * @param {string} cwd - The current working directory. Default is `process.cwd()`.
 * @returns {string} - The absolute path. If the input path is already absolute, it returns the input path itself.
 */
export function getFullPath(
  inputPath: string,
  cwd: string = process.cwd()
): string {
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(cwd, inputPath);
}
