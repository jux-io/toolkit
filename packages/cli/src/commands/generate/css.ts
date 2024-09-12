import { Flags } from '@oclif/core';
import { JuxCommand } from '../../baseCommand';
import { getConfigContext, PostcssManager } from '@juxio/core';
import path from 'node:path';

export default class Generate extends JuxCommand<typeof Generate> {
  static description = 'Generate type definitions';
  static examples = [
    `<%= config.bin %> <%= command.id %> --output=./src/styles.css`,
  ];

  static flags = {
    cwd: Flags.string({
      description: 'The current working directory for the command',
      default: process.cwd(),
      noCacheDefault: true,
      required: false,
    }),
    output: Flags.string({
      description: 'Output file for generated CSS',
      char: 'o',
      noCacheDefault: true,
      required: true,
    }),
  };

  async run() {
    const { flags } = await this.parse(Generate);

    const ctx = await getConfigContext({
      cwd: flags.cwd,
      oclifConfig: this.config,
    });

    const postcssManager = new PostcssManager();
    await postcssManager.init({ cwd: flags.cwd });
    await postcssManager.parseFiles();

    const css = await postcssManager.getCSS();

    ctx.fs.writeAsset({
      directory: path.dirname(path.join(flags.cwd, flags.output)),
      files: [
        {
          name: path.basename(flags.output),
          content: css,
        },
      ],
    });

    return true;
  }
}
