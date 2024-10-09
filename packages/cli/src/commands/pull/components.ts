import { Flags } from '@oclif/core';
import { JuxCommand } from '../../baseCommand';
import {
  getAndVerifyInternalConfig,
  getConfigContext,
  AxiosError,
} from '@juxio/core';
import ora from 'ora';
import { getFullPath } from '@juxio/core';

export default class PullComponents extends JuxCommand<typeof PullComponents> {
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

    directory: Flags.string({
      description: 'Output directory for generated files',
      char: 'd',
      noCacheDefault: false,
      required: false,
    }),

    cwd: Flags.string({
      description: 'The current working directory for the command',
      default: process.cwd(),
      noCacheDefault: true,
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(PullComponents);

    const internalConfig = getAndVerifyInternalConfig(this.config.configDir);

    const ctx = await getConfigContext({
      cwd: flags.cwd,
      oclifConfig: this.config,
      internalConfig,
    });

    const spinner = ora(`Generating assets...\n`).start();

    const directory = flags.directory
      ? getFullPath(flags.directory, flags.cwd)
      : undefined;

    try {
      const components = await ctx.pullGeneratedComponentsCode(
        flags.components || [],
        directory
      );

      spinner.succeed('Done');

      components.map((a) => ctx.fs.writeAsset(a));
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        spinner.warn(error.response.data.message);
      } else {
        spinner.fail('Failed to generate assets');
        throw new Error(error);
      }
    } finally {
      spinner.stop();
    }

    return true;
  }
}
