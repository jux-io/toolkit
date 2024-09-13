import type { TSConfig } from 'pkg-types';
import { findConfig } from './find-config.ts';
import { bundleRequire } from 'bundle-require';
import type { JuxCLIConfig } from './config.types.ts';
import { GetConfigContextOptions, LoadConfigRes } from './load-config.ts';
import deepmerge from 'deepmerge';
// @ts-expect-error load-tsconfig is not typed
import { loadTsConfig } from 'load-tsconfig';
import { baseUtilities } from '../utilities/base-utilities';

export interface LoadTsConfigRes {
  path: string;
  data: TSConfig;
}

async function require<T>(options: {
  filepath: string;
  tsconfig?: TSConfig;
  cwd: string;
}) {
  return bundleRequire<T>({
    filepath: options.filepath,
    tsconfig: options.tsconfig,
    cwd: options.cwd,
  });
}

/**
 * Since the user can define multiple presets, we need to merge all presets into a single config
 */
export async function resolveFinalConfig(
  config: JuxCLIConfig
): Promise<JuxCLIConfig> {
  const stack: JuxCLIConfig[] = [config];
  const configs: JuxCLIConfig[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const presets = current.presets ?? [];

    for (const preset of presets) {
      // User defined a preset object. E.g. presets: [{ ... }]
      stack.push(preset);
    }

    configs.unshift(current);
  }

  const finalConfig = configs.reduce((accumulator, currentObject) => {
    return deepmerge(accumulator, currentObject);
  }, {} as JuxCLIConfig);

  // We already merged the presets, so we can remove them
  finalConfig.presets = [];

  finalConfig.core_tokens = finalConfig.core_tokens ?? {};
  finalConfig.themes = finalConfig.themes ?? {};
  finalConfig.include = finalConfig.include ?? [];
  finalConfig.components_directory =
    finalConfig.components_directory ?? './src/jux/components';
  finalConfig.tokens_directory =
    finalConfig.tokens_directory ?? './src/jux/tokens';
  finalConfig.definitions_directory =
    finalConfig.definitions_directory ?? './src/jux/definitions';

  // Add default utility values
  finalConfig.utilities = {
    ...baseUtilities,
    ...finalConfig.utilities,
  };

  return finalConfig;
}

export async function loadCliConfig(
  options: GetConfigContextOptions & { tsConfig?: TSConfig }
): Promise<
  | (Pick<LoadConfigRes, 'cliConfig' | 'configPath'> & {
      tsconfig?: LoadTsConfigRes;
    })
  | undefined
> {
  const configPath = findConfig(options);

  if (!configPath) {
    return;
  }

  const tsConfigRes: LoadTsConfigRes | null = loadTsConfig(options.cwd);

  const { mod } = await require<{ default: JuxCLIConfig }>({
    filepath: configPath,
    tsconfig: tsConfigRes?.data,
    cwd: options.cwd,
  });

  if (!mod.default) {
    throw new Error('Config must export a default object');
  }

  if (typeof mod.default !== 'object') {
    throw new Error('Config must be an object');
  }

  const cliConfig = await resolveFinalConfig(mod.default);

  return {
    cliConfig,
    configPath,
    tsconfig: tsConfigRes
      ? {
          data: tsConfigRes.data,
          path: tsConfigRes.path,
        }
      : undefined,
  };
}
