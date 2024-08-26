import type { TSConfig } from 'pkg-types';
import { findConfig } from './find-config.ts';
import { bundleRequire } from 'bundle-require';
import type { JuxCLIConfig, PresetConfig } from './config.types.ts';
import { colorScheme, logger } from '../utils';
import {
  LoadConfigOptions,
  LoadConfigRes,
  rawConfigSchema,
} from './load-config.ts';
import deepmerge from 'deepmerge';

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
  config: JuxCLIConfig,
  options: LoadConfigOptions & { tsConfig?: TSConfig }
): Promise<JuxCLIConfig> {
  const stack: JuxCLIConfig[] = [config];
  const configs: JuxCLIConfig[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const presets = current.presets ?? [];

    for (const preset of presets) {
      if (typeof preset === 'string') {
        // User defined a string preset. E.g. presets: ['@juxio/preset']
        // We need to import this library and push the config to the stack
        const { mod } = await require<PresetConfig>({
          filepath: preset,
          tsconfig: options.tsConfig,
          cwd: options.cwd,
        });

        configs.push(mod);
      } else {
        // User defined a preset object. E.g. presets: [{ ... }]
        // We can push this object directly to the stack
        stack.push(preset);
      }
    }

    configs.unshift(current);
  }

  return configs.reduce((accumulator, currentObject) => {
    return deepmerge(accumulator, currentObject);
  }, {} as JuxCLIConfig);
}

export async function loadCliConfig(
  options: LoadConfigOptions & { tsConfig?: TSConfig }
): Promise<Pick<LoadConfigRes, 'cliConfig' | 'configPath'> | undefined> {
  const configPath = findConfig(options);

  if (!configPath) {
    return;
  }

  const { mod } = await require<{ default: JuxCLIConfig }>({
    filepath: configPath,
    tsconfig: options.tsConfig,
    cwd: options.cwd,
  });

  if (!mod.default) {
    throw new Error('Config must export a default object');
  }

  if (typeof mod.default !== 'object') {
    throw new Error('Config must be an object');
  }

  const cliConfig = await resolveFinalConfig(mod.default, options);

  const parseResult = rawConfigSchema.safeParse(cliConfig);

  if (!parseResult.success) {
    parseResult.error.errors.forEach((error) => {
      logger.error(
        `Config error in ${colorScheme.debug(error.path.join('.'))}: ${error.message}`
      );
    });

    throw new Error('Invalid config file');
  }

  return {
    cliConfig,
    configPath,
  };
}
