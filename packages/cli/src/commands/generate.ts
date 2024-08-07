import { Flags } from '@oclif/core';
import { JuxCommand } from '../baseCommand';
import { getAndVerifyInternalConfig, getConfigContext } from '@juxio/core';

export default class Generate extends JuxCommand<typeof Generate> {
  static description = 'Generate type definitions';
  static examples = [
    `<%= config.bin %> <%= command.id %>`,
    `<%= config.bin %> <%= command.id %> --tokens-only`,
  ];

  static flags = {
    tokensOnly: Flags.boolean({
      description: 'Generate tokens definitions only',
      default: false,
      required: false,
    }),

    cwd: Flags.string({
      description: 'The current working directory for the command',
      default: process.cwd(),
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(Generate);
    const internalConfig = getAndVerifyInternalConfig(this.config.configDir);

    const ctx = await getConfigContext(
      {
        cwd: flags.cwd,
      },
      this.config,
      internalConfig
    );

    const assets = await ctx.generateAssets();

    assets.map((a) => ctx.fs.writeAsset(a));
  }
}
