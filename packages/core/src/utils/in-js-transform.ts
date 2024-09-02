import { TokensManager } from '../tokens';
import { transform, TransformCacheCollection } from '@wyw-in-js/transform';
import { asyncResolveFallback } from '@wyw-in-js/shared';
import { transformAstro } from '../transformers/astro';
import { TextEncoder, TextDecoder } from 'util';
import { unlinkSync } from 'node:fs';

interface InJsTransformOptions {
  code: string;
  filePath: string;
  cwd: string;
  tokens: TokensManager;
}

const cache = new TransformCacheCollection();

export async function inJsTransform(options: InJsTransformOptions) {
  let filename = options.filePath;
  let code = options.code;
  let isJuxTransform = false;
  if (options.filePath.endsWith('.astro')) {
    const astroResult = await transformAstro(
      options.code,
      options.filePath,
      options.cwd
    );

    code = astroResult.code;
    filename = astroResult.filePath;
    isJuxTransform = true;
  }

  const transformService = {
    options: {
      filename,
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

  return transform(transformService, code, async (what, importer, stack) => {
    // TODO: Implement import resolver
    return asyncResolveFallback(what, importer, stack);
  }).then((result) => {
    // We only create files for unique frameworks (like Astro) which requires additional transpile step,
    // so delete the .ts file we created previously
    if (isJuxTransform) {
      unlinkSync(filename);
    }
    return result;
  });
}
