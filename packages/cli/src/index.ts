import { JuxCLIConfig } from '@juxio/core';
import { Tokens } from '@juxio/core';

export { run } from '@oclif/core';

export function defineConfig(config: JuxCLIConfig) {
  return config;
}

export function defineTokenSet(tokens: Tokens): Tokens {
  return Object.keys(tokens).length === 0 ? {} : tokens;
}
