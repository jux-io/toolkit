import postcss, { type PluginCreator } from 'postcss';
import { logger, type PluginOptions, PostcssManager } from '@juxio/core';
import * as util from 'node:util';
import path from 'node:path';

const shouldSkip = (fileName: string | undefined) => {
  if (!fileName) return true;

  const [filePath] = fileName.split('?');
  const isValidCss = path.extname(filePath) === '.css';

  if (!isValidCss) return true;

  return /node_modules/.test(fileName);
};

const postcssManager = new PostcssManager();

const juxtacss: PluginCreator<PluginOptions> = (options = {}) => {
  const { cwd, configPath } = options;
  return {
    postcssPlugin: '@juxio/postcss',
    plugins: [
      async (root, result) => {
        try {
          // Skip if css file is from node_modules
          if (shouldSkip(result.opts.from)) return;

          if (!PostcssManager.validateRoot(root)) {
            logger.debug(
              `File ${result.opts.from} does not contain valid jux layer names. Skipping...`
            );
            return;
          }

          await postcssManager.init({ cwd: cwd ?? process.cwd(), configPath });

          await postcssManager.parseFiles();

          const css = await postcssManager.getCSS(root);

          root.append(postcss.parse(css, result.opts));

          // Register the dependencies for this css file
          postcssManager.registerDependencies((dependency) => {
            result.messages.push({
              ...dependency,
              plugin: '@juxio/postcss',
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
