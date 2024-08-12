import { Flags } from '@oclif/core';
import { JuxCommand } from '../../baseCommand';
import { getAndVerifyInternalConfig, getConfigContext } from '@juxio/core';
import ora from 'ora';

export default class Pull extends JuxCommand<typeof Pull> {
  static description = 'Pull components from Jux editor';
  static examples = [
    `<%= config.bin %> <%= command.id %> -c component1 component2 component3`,
    `<%= config.bin %> <%= command.id %> --all`,
  ];

  static flags = {
    components: Flags.string({
      char: 'c',
      description:
        'Pull specific components. Separate multiple components with a space.',
      required: false,
      multiple: true,
    }),

    cwd: Flags.string({
      description: 'The current working directory for the command',
      default: process.cwd(),
      noCacheDefault: true,
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(Pull);
    const internalConfig = getAndVerifyInternalConfig(this.config.configDir);

    const ctx = await getConfigContext(
      {
        cwd: flags.cwd,
      },
      this.config,
      internalConfig
    );

    const spinner = ora(`Generating assets...\n`).start();

    const assets = await ctx.pullAssets({
      components: flags.components || [],
    });

    assets.map((a) => ctx.fs.writeAsset(a));

    spinner.succeed('Done');
  }
}