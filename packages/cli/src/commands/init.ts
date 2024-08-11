import { Flags } from '@oclif/core';
import { prompt } from 'enquirer';
import execa from 'execa';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import ora from 'ora';

import { JuxCommand } from '../baseCommand';
import {
  DEFAULT_JUX_CONFIG,
  JuxCliConfigOptions,
  setupJuxConfig,
  getPackageManager,
  logger,
} from '@juxio/core';

export default class Init extends JuxCommand<typeof Init> {
  static description = 'initialize your project and install dependencies';
  static examples = [`<%= config.bin %> <%= command.id %> -d`];

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

    interactive: Flags.boolean({
      char: 'i',
      default: false,
      description: 'Run in interactive mode',
      required: false,
    }),
  };

  // TODO: Dependencies to install, should be @jux/cli and @jux/primitives
  private dependencies = [];

  async run() {
    const { flags } = await this.parse(Init);

    const cwd = resolve(flags.cwd);

    if (!existsSync(cwd)) {
      logger.info(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    let cliConfigOptions = DEFAULT_JUX_CONFIG;

    if (flags.interactive) {
      try {
        cliConfigOptions = await prompt<JuxCliConfigOptions>([
          {
            initial: true,
            message: 'Would you like to use TypeScript (recommended)?',
            name: 'tsx',
            type: 'confirm',
          },
          {
            choices: ['styled'],
            message: 'How would you like to style your components?',
            name: 'styled_option',
            type: 'select',
          },
          {
            initial: './src/components/jux',
            message: 'Where would you like to save Jux components?',
            name: 'directory',
            type: 'input',
          },
          {
            initial: './src/design-tokens',
            message: 'Where would you like to save Jux design tokens?',
            name: 'directory',
            type: 'input',
          },
          {
            initial: true,
            message: 'Are you using React Server Components?',
            name: 'rsc',
            type: 'confirm',
          },
        ]);
      } catch (error) {
        // User cancelled prompt, exit
        return this.exit();
      }
    } else {
      logger.debug('Using default configurations');
    }

    if (!(await setupJuxConfig(cwd, cliConfigOptions, flags.force))) {
      return;
    }

    const packageManager = await getPackageManager(cwd);

    const spinner = ora(`Installing dependencies...`).start();

    // Install dependencies
    await execa(
      packageManager,
      [
        packageManager === 'npm' ? 'install' : 'add',
        this.dependencies.join(' '),
      ],
      {
        cwd,
      }
    );

    spinner.succeed('Done.');
  }
}
