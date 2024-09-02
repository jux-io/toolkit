import { TokensManager } from '../tokens';
import { transform, TransformCacheCollection } from '@wyw-in-js/transform';
import { asyncResolveFallback } from '@wyw-in-js/shared';
import { TextEncoder, TextDecoder } from 'util';

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overrideContext: (context: Partial<Record<string, any>>) => {
          // When running in a VM, we need to provide TextEncoder and TextDecoder
          context.TextEncoder = TextEncoder;
          context.TextDecoder = TextDecoder;
          return context;
        },
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
