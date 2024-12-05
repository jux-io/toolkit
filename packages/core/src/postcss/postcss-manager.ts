import { getConfigContext, JuxContext } from '../config';
import { colorScheme, logger } from '../utils';
import { Message, Root } from 'postcss';
import path, { normalize, resolve } from 'path';
import * as util from 'node:util';
import {
  ConfigTsOptions,
  getFileDependencies,
} from '../utils/get-file-dependencies';
import { convertTsPathsToRegexes } from '../utils/ts-config-paths';
import { findConfig } from '../config';
import { parseDependencies } from '../utils/parse-dependencies.ts';
import { LAYERS } from '../stylesheet';
import { inJsTransform } from '../utils/in-js-transform.ts';

// A map of files to their last modified time.
export const fileModifiedMap = new Map<string, number>();

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
      fileModifiedMap.set(
        configPath,
        this.juxContext.fs.getFileModifiedTime(configPath)
      );
      this.hasConfigChanged = true;
      return;
    }

    // Check if we should reload the context
    this.hasConfigChanged = await this.context.reloadConfigFile(async () => {
      logger.info('Reloading config file...');
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

  async parseFile(filePath: string) {
    const metadata =
      this.filesToWatch?.changes.get(filePath) ??
      this.getFileMetadata(filePath);

    if (metadata.isUnchanged && !this.hasConfigChanged) return;

    logger.debug(
      `Parsing file: ${colorScheme.verbose(path.relative(this.context.cwd, filePath))}`
    );

    const code = this.context.fs.readFile(filePath);

    try {
      const result = await inJsTransform({
        code,
        filePath,
        cwd: this.context.cwd,
        tokens: this.context.tokens,
        conditions: this.context.conditions,
        utilities: this.context.utilities,
      });

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

  async getCSS(root?: Root) {
    const css: string[] = [];
    this.context.stylesheetManager.layers.juxbase.removeAll();
    this.context.stylesheetManager.layers.juxtokens.removeAll();

    if (this.context.cliConfig.builtInFonts) {
      // If user has enabled built-in fonts, inject the Google Fonts stylesheet based on given configuration
      css.push(
        this.context.stylesheetManager.generateGoogleFontsStyles(
          this.context.cliConfig.builtInFonts.google
        ) + '\n\n'
      );
    }
    await this.context.stylesheetManager.appendBaseStyles();

    // Clear all the previous layers
    root?.walkAtRules('layer', (atRule) => {
      if (
        VALID_LAYER_NAMES.every((name) =>
          atRule.params
            .split(',')
            .map((name) => name.trim())
            .includes(name)
        )
      ) {
        // Remove the layer if it contains all the valid layer names
        atRule.remove();
      }
      // @ts-expect-error safe to ignore as we know that params is a string
      if (LAYERS.includes(atRule.params.trim())) {
        atRule.remove();
      }
    });

    css.push(this.context.stylesheetManager.layers.juxbase.toString());
    css.push(this.context.stylesheetManager.layers.juxtokens.toString());
    css.push(this.context.stylesheetManager.layers.juxutilities.toString());

    return this.context.stylesheetManager.transformCss(css.join('\r\n'));
  }

  registerDependencies(register: (dependency: Message) => void) {
    for (const fileOrGlob of this.context.cliConfig.include ?? []) {
      const dependency = parseDependencies(fileOrGlob, this.context.cwd);
      if (dependency) {
        register(dependency);
      }
    }

    for (const file of this.configDependencies) {
      register({ type: 'dependency', file: normalize(resolve(file)) });
    }
  }
}
