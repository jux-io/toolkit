import { TokensManager } from '../tokens';
import { transform, TransformCacheCollection } from '@wyw-in-js/transform';
import { syncResolve } from '@wyw-in-js/shared';
import { TextEncoder, TextDecoder } from 'util';
import { ConditionsManager } from '../conditions/conditions-manager.ts';
import { UtilitiesManager } from '../utilities/utilities-manager.ts';

interface InJsTransformOptions {
  code: string;
  filePath: string;
  cwd: string;
  tokens: TokensManager;
  conditions: ConditionsManager;
  utilities: UtilitiesManager;
}

const cache = new TransformCacheCollection();

export async function inJsTransform(options: InJsTransformOptions) {
  const transformService = {
    options: {
      filename: options.filePath,
      root: options.cwd,
      pluginOptions: {
        tokens: options.tokens,
        conditions: options.conditions,
        utilities: options.utilities,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overrideContext: (context: Partial<Record<string, any>>) => {
          // When running in a VM, we need to provide TextEncoder and TextDecoder as some libraries use them
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
      return syncResolve(what, importer, stack);
    }
  );
}
