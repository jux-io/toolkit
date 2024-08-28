import { Flags } from '@oclif/core';
import { JuxCommand } from '../baseCommand';
import { getConfigContext } from '@juxio/core';

export default class Generate extends JuxCommand<typeof Generate> {
  static description = 'Generate type definitions';
  static examples = [
    `<%= config.bin %> <%= command.id %>`,
    `<%= config.bin %> <%= command.id %> --tokens-only`,
  ];

  static flags = {
    cwd: Flags.string({
      description: 'The current working directory for the command',
      default: process.cwd(),
      noCacheDefault: true,
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(Generate);

    const ctx = await getConfigContext(
      {
        cwd: flags.cwd,
      },
      this.config
    );

    const assets = await ctx.generateAssets();

    assets.map((a) => ctx.fs.writeAsset(a));

    return true;
  }
}
