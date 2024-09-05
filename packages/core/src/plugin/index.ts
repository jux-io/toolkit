import type { UnpluginFactory } from 'unplugin';
import { createUnplugin } from 'unplugin';
import { cosmiconfigSync } from 'cosmiconfig';
import type { Options } from './types';

import path from 'path';
import { logger } from '../utils';
import { JuxCLIConfig } from '../config';

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options
) => {
  const explorer = cosmiconfigSync('jux');
  const explorerRes = explorer.search(process.cwd() + '/astro-app');

  if (!explorerRes) {
    logger.error(`Config not found at ${process.cwd()}`);
  }

  let config: JuxCLIConfig = explorerRes?.config;

  return {
    name: '@juxio/core',
    enforce: 'post',
    transformInclude(id) {
      return !config || !id.includes('node_modules');
    },
    watchChange(id /*,change*/) {
      if (id === explorerRes?.filepath) {
        // Reload the config
        explorer.clearCaches();
        const newExplorerRes = explorer.search(process.cwd() + '/astro-app');
        config = newExplorerRes?.config;
      }
    },
    transform(code: string /*,url: string*/) {
      this.addWatchFile(path.join(process.cwd(), 'astro-app', 'jux.config.ts'));
      // const [id] = url.split('?', 1);

      return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`);
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
