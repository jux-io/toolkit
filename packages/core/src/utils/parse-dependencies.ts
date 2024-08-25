import isGlob from 'is-glob';
import { normalize, resolve } from 'path';
import type { Message } from 'postcss';
import { parseGlob } from './parse-glob';

export function parseDependencies(fileOrGlob: string): Message | null {
  if (fileOrGlob.startsWith('!')) {
    return null;
  }

  let message: Message;

  if (isGlob(fileOrGlob)) {
    const { base, glob } = parseGlob(fileOrGlob);
    message = { type: 'dir-dependency', dir: normalize(resolve(base)), glob };
  } else {
    message = { type: 'dependency', file: normalize(resolve(fileOrGlob)) };
  }

  return message;
}
