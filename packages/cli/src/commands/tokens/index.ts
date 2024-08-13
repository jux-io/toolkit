import { Flags } from '@oclif/core';
import { JuxCommand } from '../../baseCommand';
import { getAndVerifyInternalConfig, getConfigContext } from '@juxio/core';

export default class Tokens extends JuxCommand<typeof Tokens> {
  static description = 'Generate token definitions';
  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    cwd: Flags.string({
      char: 'c',
      description: 'The current working directory for the command',
      default: process.cwd(),
      noCacheDefault: true,
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(Tokens);

    const internalConfig = getAndVerifyInternalConfig(this.config.configDir);

    const ctx = await getConfigContext(
      {
        cwd: flags.cwd,
      },
      this.config,
      internalConfig
    );

    const tokens = await ctx.generateTokensDefinitions();

    tokens.map((a) => ctx.fs.writeAsset(a));
  }
}
