import { getConfigContext, JuxContext } from '../config';
import { colorScheme, logger } from '../utils';
import { Root } from 'postcss';
import path from 'path';
import { transform, TransformCacheCollection } from '@wyw-in-js/transform';
import * as util from 'node:util';
import {
  ConfigTsOptions,
  getFileDependencies,
} from '../utils/get-file-dependencies';
import { convertTsPathsToRegexes } from '../utils/ts-config-paths';
import { findConfig } from '../config/find-config';

// A map of files to their last modified time.
const fileModifiedMap = new Map<string, number>();

export interface FileMeta {
  modifiedMs: number;
  isUnchanged: boolean;
}

interface FileChanges {
  changes: Map<string, FileMeta>;
  hasFilesChanged: boolean;
}

export interface PluginOptions {
  configPath?: string;
  cwd?: string;
}

const VALID_LAYER_NAMES = ['juxbase', 'juxtokens', 'juxutilities'];

export class PostcssManager {
  public juxContext: JuxContext | undefined;

  private configDependencies = new Set<string>();

  private hasConfigChanged = false;

  /**
   * A map of files to watch and their recent modification time
   * @private
   */
  private filesToWatch: FileChanges | undefined;

  configDeps(cwd: string, configPath: string) {
    let tsOptions: ConfigTsOptions | undefined;
    const compilerOptions = this.juxContext?.tsconfig?.compilerOptions ?? {};

    if (compilerOptions?.paths) {
      tsOptions = {
        baseUrl: compilerOptions.baseUrl,
        pathMappings: convertTsPathsToRegexes(
          compilerOptions.paths,
          compilerOptions.baseUrl ?? cwd
        ),
      };
    }

    const configDeps = getFileDependencies(
      configPath,
      cwd,
      tsOptions,
      compilerOptions
    );

    configDeps.deps.forEach((filePath) =>
      this.configDependencies.add(filePath)
    );
  }

  async init(options: PluginOptions) {
    logger.debug('Initializing PostcssManager...');
    const cwd = options.cwd ?? process.cwd();

    const configPath = findConfig({ cwd }) ?? cwd;

    this.configDeps(cwd, configPath);

    if (!this.juxContext) {
      this.juxContext = await getConfigContext({
        cwd,
      });
      this.hasConfigChanged = true;
      return;
    }

    // Check if we should reload the context
    this.hasConfigChanged = await this.context.reloadConfigFile(async () => {
      logger.debug('Reloading config file...');
      this.juxContext = await getConfigContext({
        cwd,
      });
    });

    this.filesToWatch = this.checkChangedFiles(this.context.getFilesToWatch());
  }

  getFileMetadata(filePath: string) {
    const modifiedMs = this.context.fs.getFileModifiedTime(filePath);
    return {
      modifiedMs,
      isUnchanged:
        fileModifiedMap.has(filePath) &&
        modifiedMs === fileModifiedMap.get(filePath),
    };
  }

  checkChangedFiles(filesToCheck: string[]) {
    const changes = new Map<string, FileMeta>();

    let hasFilesChanged = false;

    for (const file of filesToCheck) {
      const metadata = this.getFileMetadata(file);
      changes.set(file, metadata);
      if (!metadata.isUnchanged) {
        hasFilesChanged = true;
      }
    }

    return { changes, hasFilesChanged };
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
  static validateRoot(root: Root) {
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
    if (this.hasConfigChanged) {
      logger.debug('Emitting assets...');
      const assets = await this.context.generateAssets();

      assets.map((a) => this.context.fs.writeAsset(a));
    }
  }

  async parseFile(filePath: string) {
    const metadata =
      this.filesToWatch?.changes.get(filePath) ??
      this.getFileMetadata(filePath);

    if (metadata.isUnchanged && !this.hasConfigChanged) return;

    logger.debug(
      `Parsing file: ${colorScheme.verbose(path.relative(this.context.cwd, filePath))}`
    );

    const cache = new TransformCacheCollection();

    const code = this.context.fs.readFile(filePath);

    const transformService = {
      options: {
        filename: filePath,
        root: this.context.cwd,
        pluginOptions: {
          tokens: this.context.tokens,
          babelOptions: {
            presets: [
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                },
              ],
              [
                '@babel/preset-env',
                {
                  modules: false,
                },
              ],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      cache,
    };

    try {
      const result = await transform(
        transformService,
        code,
        async (/* what, importer, stack */) => {
          // TODO: Implement import resolver
          return null;
        }
      );

      for (const key of Object.keys(result.rules ?? {})) {
        // We can safely cast as we will get here only if key exist in result.rules
        const rule = result.rules![key];
        this.context.stylesheetManager.appendClassName(
          filePath,
          'juxutilities',
          rule.className,
          rule.cssText
        );
      }
    } catch (error) {
      logger.error(`Error parsing file: ${filePath}`);
      logger.debug(util.inspect(error, { showHidden: false, depth: null }));
    } finally {
      fileModifiedMap.set(filePath, metadata.modifiedMs);
    }
  }

  async parseFiles() {
    if (!this.filesToWatch && !this.hasConfigChanged) {
      logger.debug(`No files to parse`);
      return;
    }

    const filesToParse = this.context.getFilesToWatch();

    for (const file of filesToParse) {
      await this.parseFile(file);
    }

    this.hasConfigChanged = false;
  }

  async injectStyles(root: Root) {
    const css: string[] = [];
    this.context.stylesheetManager.layers.juxbase.removeAll();
    this.context.stylesheetManager.layers.juxtokens.removeAll();
    await this.context.stylesheetManager.appendBaseStyles();

    root.removeAll();

    if (this.context.cliConfig.builtInFonts) {
      // If user has enabled built-in fonts, inject the Google Fonts stylesheet based on given configuration
      css.push(
        this.context.stylesheetManager.generateGoogleFontsStyles(
          this.context.cliConfig.builtInFonts.google
        )
      );
    }

    css.push(this.context.stylesheetManager.layers.juxbase.toString());
    css.push(this.context.stylesheetManager.layers.juxtokens.toString());
    css.push(this.context.stylesheetManager.layers.juxutilities.toString());

    root.append(this.context.stylesheetManager.transformCss(css.join('\n\n')));
  }

  getWatchedFiles() {
    // Collect all the files we should watch, so once they change, postcss manager can re-parse them
    const watchedFiles = this.context.getFilesToWatch();
    return Array.from([...this.configDependencies, ...watchedFiles]);
  }
}
