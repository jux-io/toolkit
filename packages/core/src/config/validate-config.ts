import { type JuxCLIConfig } from './config.types';
import { DesignTokensParser } from '@juxio/design-tokens';
import { rawConfigSchema } from './load-config.ts';
import { colorScheme, logger } from '../utils';

export function validateConfig(config?: JuxCLIConfig) {
  if (!config) {
    throw new Error('Config must export a default object');
  }

  if (typeof config !== 'object') {
    throw new Error('Config must be an object');
  }

  const parseResult = rawConfigSchema.safeParse(config);

  if (!parseResult.success) {
    parseResult.error.errors.forEach((error) => {
      logger.error(
        `Config error in ${colorScheme.debug(error.path.join('.'))}: ${error.message}`
      );
    });

    throw new Error('Invalid config file');
  }

  // TODO: Make sure a color token can't reference a border token for example.
  // To do this we can collect all "color" category separately and try to resolve them.

  if (config.themes?.core) {
    throw new Error('Core tokens should not be defined in themes');
  }

  // TODO: Design tokens should return all errors in a single array, to prevent forcing the user to fix one error at a time.
  new DesignTokensParser({
    core: config.core_tokens ?? {},
    ...config.themes,
  });
  return true;
}
