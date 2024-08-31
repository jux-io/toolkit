import { TokensManager } from '../tokens';
import { transform, TransformCacheCollection } from '@wyw-in-js/transform';
import { asyncResolveFallback } from '@wyw-in-js/shared';

interface InJsTransformOptions {
  code: string;
  filePath: string;
  cwd: string;
  tokens: TokensManager;
}

const cache = new TransformCacheCollection();

export async function inJsTransform(options: InJsTransformOptions) {
  const transformService = {
    options: {
      filename: options.filePath,
      root: options.cwd,
      pluginOptions: {
        tokens: options.tokens,
        babelOptions: {
          presets: [
            [
              '@babel/preset-react',
              {
                runtime: 'automatic',
              },
            ],
            [
              '@babel/preset-env',
              {
                modules: false,
              },
            ],
            '@babel/preset-typescript',
          ],
        },
      },
    },
    cache,
  };

  return transform(
    transformService,
    options.code,
    async (what, importer, stack) => {
      // TODO: Implement import resolver
      return asyncResolveFallback(what, importer, stack);
    }
  );
}
