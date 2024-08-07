import type { PluginCreator } from 'postcss';
import { logger, type PluginOptions, PostcssManager } from '@juxio/core';

const postcssManager = new PostcssManager();

const juxtacss: PluginCreator<PluginOptions> = (options = {}) => {
  const { cwd, configPath, allow } = options;
  return {
    postcssPlugin: '@juxio/postcss',
    plugins: [
      async (root, result) => {
        try {
          await postcssManager.init({ cwd, allow, configPath });

          if (!postcssManager.validateRoot(root)) {
            return;
          }

          await postcssManager.emitAssets();

          postcssManager.parseFiles();

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
          console.trace(error);
          logger.error(error.message);
        }
      },
    ],
  };
};

juxtacss.postcss = true;

export default juxtacss;
