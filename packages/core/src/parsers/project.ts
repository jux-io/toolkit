import { Project as TSProject } from 'ts-morph';
import { LoadConfigRes } from '../config';

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
}
