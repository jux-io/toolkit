import type { PluginCreator } from 'postcss';
import { logger, type PluginOptions, PostcssManager } from '@juxio/core';
import * as util from 'node:util';

const postcssManager = new PostcssManager();

const juxtacss: PluginCreator<PluginOptions> = (options = {}) => {
  const { cwd, configPath } = options;
  return {
    postcssPlugin: '@juxio/postcss',
    plugins: [
      async (root, result) => {
        try {
          if (!PostcssManager.validateRoot(root)) {
            logger.debug(
              `File ${result.opts.from} does not contain valid jux layer names. Skipping...`
            );
            return;
          }

          await postcssManager.init({ cwd: cwd ?? process.cwd(), configPath });

          await postcssManager.emitAssets();

          await postcssManager.parseFiles();

          await postcssManager.injectStyles(root);

          // Register the dependencies for this css file
          postcssManager.getWatchedFiles().forEach((file) => {
            result.messages.push({
              type: 'dependency',
              plugin: '@juxio/postcss',
              file,
              parent: result.opts.from,
            });
          });
        } catch (error) {
          logger.error(util.inspect(error, { showHidden: false, depth: null }));
        }
      },
    ],
  };
};

juxtacss.postcss = true;

export default juxtacss;
