import { Flags } from '@oclif/core';
import { JuxCommand } from '../../baseCommand';
import {
  getAndVerifyInternalConfig,
  getConfigContext,
  logger,
} from '@juxio/core';

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

    const ctx = await getConfigContext(
      {
        cwd: flags.cwd,
      },
      this.config,
      internalConfig
    );

    const tokens = await ctx.pullDesignTokens(flags.definitions);

    tokens.map((a) => ctx.fs.writeAsset(a));

    if (flags.definitions) {
      logger.info('Generating token definitions');
      const assets = await ctx.generateTokensDefinitions();
      assets.map((a) => ctx.fs.writeAsset(a));
    }
  }
}
