import { Flags } from '@oclif/core';
import { JuxCommand } from '../../baseCommand';
import { getConfigContext, getFullPath } from '@juxio/core';

export default class Generate extends JuxCommand<typeof Generate> {
  static description = 'Generate type definitions';
  static examples = [
    `<%= config.bin %> <%= command.id %>`,
    `<%= config.bin %> <%= command.id %> --directory=./src/jux/types`,
  ];

  static flags = {
    cwd: Flags.string({
      description: 'The current working directory for the command',
      default: process.cwd(),
      noCacheDefault: true,
      required: false,
    }),
    directory: Flags.string({
      description: 'Output directory for generated files',
      char: 'd',
      noCacheDefault: true,
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(Generate);

    const ctx = await getConfigContext({
      cwd: flags.cwd,
      oclifConfig: this.config,
    });

    // TODO: Add directory

    const assets = await ctx.generateAssets(flags.directory);

    assets.forEach((a) => {
      ctx.fs.writeAsset({
        ...a,
        directory: flags.directory
          ? getFullPath(flags.directory, flags.cwd)
          : a.directory,
      });
    });

    return true;
  }
}
