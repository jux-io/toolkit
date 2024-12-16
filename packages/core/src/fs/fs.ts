import { type Asset } from '../assets';

import * as fs from 'fs-extra';
import { globSync } from 'glob';
import { colorScheme, logger } from '../utils';
import path from 'path';
import * as prettier from 'prettier';
import { JuxCLIConfig } from '../config';

export class FileManager {
  public cwd: string = process.cwd();

  constructor(cwd?: string) {
    if (cwd) this.cwd = cwd;
  }

  public async prettierFormat(content: string) {
    return prettier.format(content, {
      ...(await prettier.resolveConfig(this.cwd)),
      parser: 'typescript',
    });
  }

  glob(options: Pick<JuxCLIConfig, 'include' | 'exclude'>) {
    const excludePatterns = options.exclude ?? [];

    if (!excludePatterns.length) {
      // If user has not provided any exclude patterns, we will exclude all .d.ts files
      excludePatterns.push('**/*.d.ts');
    }

    return globSync(options.include ?? [], {
      cwd: this.cwd,
      ignore: excludePatterns,
      absolute: true,
    });
  }

  removeFileIfExists(filePath: string) {
    if (!fs.existsSync(filePath)) return;

    logger.verbose(`Removing file: ${filePath}`);
    return fs.unlinkSync(filePath);
  }

  readFile(filePath: string) {
    return fs.readFileSync(filePath, 'utf8');
  }

  writeFile(directory: string, fileName: string, content: string) {
    fs.ensureDirSync(directory);

    // Remove the existing file if it exists
    this.removeFileIfExists(path.join(directory, fileName));

    return fs.writeFileSync(path.join(directory, fileName), content, 'utf8');
  }

  exists(filePath: string) {
    return fs.existsSync(filePath);
  }

  public writeAsset(asset: Asset): void {
    fs.ensureDirSync(asset.directory);

    for (const file of asset.files) {
      logger.info(
        `Writing asset: ${colorScheme.success(
          path.relative(this.cwd, path.join(asset.directory, file.name))
        )}`
      );

      fs.writeFileSync(
        path.join(asset.directory, file.name),
        file.content,
        'utf8'
      );
    }
  }

  public getFileModifiedTime(filePath: string) {
    return fs.existsSync(filePath) ? fs.statSync(filePath).mtimeMs : -Infinity;
  }
}
