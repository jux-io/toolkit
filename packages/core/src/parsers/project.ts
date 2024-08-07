import { Project as TSProject } from 'ts-morph';
import { LoadConfigRes } from '../config';
import {
  getImportsFromFile,
  JUX_STYLED_PACKAGES,
} from './get-imports-from-file.ts';
import { FileParser, JUX_FUNCTIONS } from './file-parser.ts';
import { logger } from '../utils';
import path from 'path';

export interface ProjectOptions {
  tsconfig: LoadConfigRes['tsconfig'];
  definitions_directory: string;
}

export class Project {
  public project: TSProject;

  constructor(private options: ProjectOptions) {
    this.project = new TSProject({
      skipLoadingLibFiles: true,
      skipAddingFilesFromTsConfig: false,
      skipFileDependencyResolution: true,
      tsConfigFilePath: this.options.tsconfig?.path,
    });
  }

  addOrRefreshFile(filePath: string) {
    const source = this.project.getSourceFile(filePath);

    if (!source) {
      this.project.addSourceFileAtPath(filePath);
    } else {
      source.refreshFromFileSystemSync();
    }
  }

  parseFile(filePath: string) {
    // In order to parse the file, its imports, and usage of styled / css functions, we need to
    // check if the functions users is importing are from the correct package / path
    const juxImportsPath = [
      JUX_STYLED_PACKAGES.react,
      path.join(
        path.basename(this.options.definitions_directory),
        JUX_FUNCTIONS.STYLED
      ),
    ];

    const sourceFile = this.project.getSourceFile(filePath);

    if (!sourceFile) {
      return;
    }

    const imports = getImportsFromFile(sourceFile, juxImportsPath);

    if (imports.length === 0) {
      logger.debug(`No imports found in ${filePath}`);
      return;
    }

    return new FileParser({
      imports,
      sourceFile,
      juxImportsPath,
    });
  }
}
