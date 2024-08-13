import { getConfigContext, JuxContext } from '../config';
import { colorScheme, logger } from '../utils';
import { Root } from 'postcss';
import path from 'path';

export interface PluginOptions {
  configPath?: string;
  loglevel?: string;
  cwd?: string;
  allow?: RegExp[];
}

const VALID_LAYER_NAMES = ['juxbase', 'juxtokens', 'juxutilities'];

export class PostcssManager {
  public juxContext: JuxContext | undefined;

  /**
   * A map of files to watch and their recent modification time
   * @private
   */
  private filesToWatch = new Map<
    string,
    {
      modifiedMs: number;
      isChanged: boolean;
    }
  >();

  async init(options: PluginOptions) {
    logger.debug('Initializing PostcssManager...');

    if (!this.juxContext) {
      this.juxContext = await getConfigContext({
        cwd: options.cwd ?? process.cwd(),
      });
    }

    // Initialize the files to watch and their recent modification time, so we can compare them later
    this.checkChangedFiles(this.context.getFilesToWatch());
  }

  checkChangedFiles(filesToCheck: string[]) {
    filesToCheck.map((file) => {
      const modifiedTime = this.context.fs.getFileModifiedTime(file);
      const previousModifiedTime = this.filesToWatch.get(file)?.modifiedMs;

      if (modifiedTime !== previousModifiedTime) {
        this.filesToWatch.set(file, {
          modifiedMs: modifiedTime,
          isChanged: true,
        });

        // Add this file as source file to project
        this.context.fileParser.addOrRefreshFile(file);
      }
    });
  }

  get context() {
    if (!this.juxContext) {
      throw new Error('Context not initialized');
    }
    return this.juxContext;
  }

  /**
   * Validate the root of the CSS file by checking if it contains a valid jux layer names
   * ```
   * @layer juxbase, juxtokens, juxutilities; => true
   * ```
   */
  validateRoot(root: Root) {
    let isValid = false;

    root.walkAtRules((rule) => {
      const names = rule.params.split(',').map((name) => name.trim());
      if (
        names.length === 3 &&
        VALID_LAYER_NAMES.every((name) => names.includes(name))
      ) {
        isValid = true;
      }
    });

    return isValid;
  }

  async emitAssets() {
    // TODO: Only emit when files are changed.
    logger.debug('Emitting assets...');
    const assets = await this.context.generateAssets();

    assets.map((a) => this.context.fs.writeAsset(a));
  }

  parseFile(filePath: string) {
    logger.debug(
      `Parsing file: ${colorScheme.verbose(path.relative(this.context.cwd, filePath))}`
    );
    const parsedFile = this.context.fileParser.parseFile(filePath);

    if (!parsedFile) {
      logger.debug(`No parsed file found for ${filePath}`);
      return;
    }

    this.context.stylesheetManager.layers.juxutilities.append(
      parsedFile.generateParsedFilesStyles(this.context.tokens)
    );

    // Mark the file as unchanged as we just parsed it
    this.filesToWatch.set(filePath, {
      ...this.filesToWatch.get(filePath)!,
      isChanged: false,
    });
  }

  parseFiles() {
    // Check if files to watch have changed
    for (const [file, { isChanged }] of this.filesToWatch) {
      if (isChanged) {
        this.parseFile(file);
      }
    }
  }

  async injectStyles(root: Root) {
    this.context.stylesheetManager.layers.juxbase.removeAll();
    this.context.stylesheetManager.layers.juxtokens.removeAll();
    await this.context.stylesheetManager.appendBaseStyles();

    root.removeAll();

    if (this.context.cliConfig.builtInFonts) {
      // If user has enabled built-in fonts, inject the Google Fonts stylesheet based on given configuration
      root.append(
        this.context.stylesheetManager.generateGoogleFontsStyles(
          this.context.cliConfig.builtInFonts.google
        )
      );
    }

    root.append(this.context.stylesheetManager.layers.juxbase);
    root.append(this.context.stylesheetManager.layers.juxtokens);
    root.append(this.context.stylesheetManager.layers.juxutilities);
  }

  getWatchedFiles() {
    return Array.from(this.filesToWatch.keys());
  }
}
