import { Flags } from '@oclif/core';
import enquirer from 'enquirer';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import ora from 'ora';

import { JuxCommand } from '../baseCommand';
import {
  setupJuxConfig,
  getPackageManager,
  logger,
  generatePostCSSConfig,
} from '@juxio/core';

export default class Init extends JuxCommand<typeof Init> {
  static description = 'initialize your project and install dependencies';
  static examples = [
    `<%= config.bin %> <%= command.id %>`,
    `<%= config.bin %> <%= command.id %> --force`,
  ];

  static flags = {
    cwd: Flags.string({
      default: process.cwd(),
      description: 'The directory to initialize the project in',
      noCacheDefault: true,
      required: false,
    }),

    force: Flags.boolean({
      char: 'f',
      default: false,
      description: 'Force overwrite of existing configuration',
      required: false,
    }),

    postcss: Flags.boolean({
      char: 'p',
      default: false,
      description: 'Whether to initialize with PostCSS',
      required: false,
    }),

    'skip-deps': Flags.boolean({
      default: false,
      description: 'Do not install dependencies',
      required: false,
    }),
  };

  private dependencies = [
    '@juxio/cli',
    '@juxio/postcss',
    '@juxio/css',
    '@juxio/react-styled',
  ];

  async run() {
    const { flags } = await this.parse(Init);

    const cwd = resolve(flags.cwd);

    if (!existsSync(cwd)) {
      logger.info(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    if (!(await setupJuxConfig(cwd, flags.force))) {
      return false;
    }

    if (flags.postcss) {
      let answer = true;
      if (existsSync(resolve(cwd, 'postcss.config.js'))) {
        answer = (
          await enquirer.prompt<{ confirm: boolean }>({
            type: 'confirm',
            name: 'confirm',
            message: 'A postcss.config.js file already exists. Overwrite?',
          })
        ).confirm;
      }

      if (answer) {
        generatePostCSSConfig(cwd);
      }
    }

    if (flags['skip-deps']) {
      return true;
    }

    const packageManager = await getPackageManager(cwd);

    const spinner = ora(`Installing dependencies...`).start();

    const { execa } = await import('execa');

    // Install dependencies
    await execa(
      packageManager,
      [packageManager === 'npm' ? 'install' : 'add', ...this.dependencies],
      {
        cwd,
      }
    );

    spinner.succeed('Done.');

    return true;
  }
}
