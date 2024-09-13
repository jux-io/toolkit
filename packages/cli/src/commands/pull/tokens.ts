import { Flags } from '@oclif/core';
import { JuxCommand } from '../../baseCommand';
import {
  AxiosError,
  getAndVerifyInternalConfig,
  getConfigContext,
  logger,
} from '@juxio/core';
import ora from 'ora';
import { getFullPath } from '@juxio/core';

export default class PullTokens extends JuxCommand<typeof PullTokens> {
  static description = 'Pull tokens from Jux editor';
  static examples = [
    `<%= config.bin %> <%= command.id %>`,
    `<%= config.bin %> <%= command.id %> -d`,
  ];

  static flags = {
    definitions: Flags.boolean({
      char: 'd',
      description: 'Generate token definitions after pull',
      default: false,
      required: false,
    }),

    directory: Flags.string({
      description: 'Output directory for generated files',
      char: 'd',
      noCacheDefault: false,
      required: false,
    }),

    cwd: Flags.string({
      char: 'c',
      description: 'The current working directory for the command',
      default: process.cwd(),
      noCacheDefault: true,
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(PullTokens);

    const internalConfig = getAndVerifyInternalConfig(this.config.configDir);

    const ctx = await getConfigContext({
      cwd: flags.cwd,
      oclifConfig: this.config,
      internalConfig,
    });

    if (!ctx.cliConfig.tokens_directory) {
      throw new Error('tokens_directory should be defined in jux.config');
    }

    const spinner = ora(`Generating tokens...\n`).start();

    const directory = flags.directory
      ? getFullPath(flags.directory, flags.cwd)
      : undefined;

    try {
      const tokens = await ctx.pullDesignTokens(false, directory);

      tokens.map((a) => ctx.fs.writeAsset(a));
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        spinner.warn(error.response.data.message);
      } else {
        spinner.fail('Failed to generate tokens');
        throw new Error(error);
      }
    }

    if (flags.definitions) {
      logger.info('Generating token definitions...');
      const assets = await ctx.generateTokensDefinitions(directory);
      assets.map((a) => ctx.fs.writeAsset(a));
    }

    spinner.succeed('Done');

    return true;
  }
}
