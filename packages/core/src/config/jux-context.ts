/* eslint-disable prettier/prettier */
import { type LoadConfigRes } from './load-config';
import bluebird from 'bluebird';
import { ComponentFileStructure, JuxAPI } from '../api';
import { type Asset } from '../assets';
import { type JuxCLIConfig, type Themes } from './config.types';
import { Config } from '@oclif/core';
import path from 'path';
import { FileManager } from '../fs';
import { TokensManager } from '../tokens';
import { outdent } from 'outdent';
import { StylesheetManager } from '../stylesheet';
import { parseRawTokenSets } from '../utils/parse-raw-token-sets';
import { TSConfig } from 'pkg-types';
import { ConfigNotFoundError } from '../utils/exceptions';
import { loadCliConfig } from './load-cli-config.ts';
import { UtilitiesManager } from '../utilities';
import { ConditionsManager } from '../conditions';
import hash from 'object-hash';
import { ComponentsMapManager } from './components-map';
import { promisify } from 'util';
import { exec } from 'child_process';
import { tmpdir } from 'os';
import { logger } from '../utils/logger.ts';

interface PullAssetsOptions {
  components: string[];
}

export class JuxContext {
  /**
   * Responsible for parsing and managing tokens
   */
  public tokens: TokensManager;

  /**
   * Responsible for managing utilities functions (custom css properties)
   */
  public utilities: UtilitiesManager;

  /**
   * Responsible for managing conditions as css properties
   */
  public conditions: ConditionsManager;

  /**
   * For reading and writing files
   */
  public readonly fs: FileManager;

  /**
   * For communicating with the Jux API. Only available after login
   */
  private readonly juxApi?: JuxAPI;

  /**
   * The CLI configuration (jux.config.ts)
   */
  public readonly cliConfig: JuxCLIConfig;

  /**
   * The path to the config file
   */
  public readonly configPath: string;

  /**
   * The working directory. It's the directory where jux.config.ts is located
   * This is to make sure we can resolve relative paths in the config file relative to config's directory
   */
  public readonly cwd: string;

  /**
   * Responsible for generating the final CSS
   */
  public stylesheetManager: StylesheetManager;

  tsconfig?: TSConfig;

  /**
   * Oclif's environment config. This is the config that is passed to the CLI.
   */
  private readonly environmentConfig: Config | undefined;

  private readonly componentsMap: ComponentsMapManager;

  constructor(config: LoadConfigRes) {
    this.tokens = new TokensManager({
      core: config.cliConfig.core_tokens ?? {},
      ...config.cliConfig.themes,
    });

    this.utilities = new UtilitiesManager({
      utilities: config.cliConfig.utilities ?? {},
      tokens: this.tokens,
    });

    this.conditions = new ConditionsManager({
      screens: config.cliConfig.screens ?? {},
    });

    this.cliConfig = config.cliConfig;
    this.configPath = config.configPath;
    this.environmentConfig = config.environmentConfig;
    this.cwd = path.parse(this.configPath).dir;
    this.fs = new FileManager(this.cwd);

    this.tsconfig = config.tsconfig?.data;

    this.juxApi =
      config.internalConfig && config.environmentConfig
        ? new JuxAPI(
            config.environmentConfig,
            config.internalConfig,
            config.apiConfig
          )
        : undefined;

    this.stylesheetManager = new StylesheetManager({
      cssVarsRoot: this.cliConfig.cssVarsRoot,
      tokensManager: this.tokens,
      preflight: !!this.cliConfig.preflight,
      globalCss: this.cliConfig.globalCss,
      utilitiesManager: this.utilities,
      conditionsManager: this.conditions,
    });

    const componentsMapFile =
      config.cliConfig.components_map_file ??
      path.join(
        config.cliConfig.components_directory ?? this.cwd,
        'juxComponents.json'
      );
    this.cliConfig.components_map_file = componentsMapFile;

    this.componentsMap = new ComponentsMapManager({
      componentsMapFile,
      fs: this.fs,
    });
  }

  get api() {
    if (!this.juxApi) {
      throw new Error('API is not initialized. Run `jux login` to login');
    }

    return this.juxApi;
  }

  public reloadTokens(tokens: Themes) {
    this.tokens = new TokensManager(tokens);
  }

  public async generateTokensDefinitions(directory?: string): Promise<Asset[]> {
    const set = new Set<string>();

    set.add(`import '@juxio/css/types';`);

    const tokensDefinitions = this.tokens.getTokensDeclaration();

    set.add(tokensDefinitions.designTokenDefinitions);

    set.add(`declare module '@juxio/css/types' {
          ${this.tokens.isEmpty ? '' : tokensDefinitions.tokenTypes}
          
          ${this.utilities.isEmpty ? '' : this.utilities.getUtilitiesTypeDeclaration()}
          
          ${this.conditions.isEmpty ? '' : this.conditions.getConditionsTypeDeclaration()}
    }`);

    return [
      {
        directory:
          /**
           * It's safe to cast here because we are sure that components_directory is defined {@link resolveFinalConfig}
           */
          directory ??
          path.join(this.cwd, this.cliConfig.definitions_directory!),
        files: [
          {
            name: 'tokens.d.ts',
            content: await this.fs.prettierFormat(
              outdent.string(Array.from(set).join('\n\n'))
            ),
          },
        ],
      },
    ];
  }

  private async mergeComponentFile({
    component,
    previousVersion,
    newContent,
  }: {
    component: ComponentFileStructure;
    previousVersion: string;
    newContent: string;
  }): Promise<string> {
    // Create temporary files for the merge
    const tempDir = tmpdir();
    const baseFile = `${component.name}.base.tsx`;
    const currentFile = `${component.name}.current.tsx`;
    const otherFile = `${component.name}.other.tsx`;

    try {
      // Write all versions to temp files
      await this.fs.writeFile(tempDir, baseFile, previousVersion);
      await this.fs.writeFile(tempDir, currentFile, newContent);

      // Read and write the current file from disk
      const currentContent = await this.fs.readFile(
        path.join(this.cwd, component.file.name)
      );
      await this.fs.writeFile(tempDir, otherFile, currentContent);

      // Execute git merge-file
      const { stdout } = await promisify(exec)(
        `git merge-file -p "${currentFile}" "${baseFile}" "${otherFile}"`
      );

      return stdout;
    } finally {
      // Cleanup temp files
      await Promise.all([
        this.fs.removeFileIfExists(path.join(tempDir, baseFile)),
        this.fs.removeFileIfExists(path.join(tempDir, currentFile)),
        this.fs.removeFileIfExists(path.join(tempDir, otherFile)),
      ]);
    }
  }

  public async pullComponents({
    components,
    directory,
  }: {
    components: string[];
    directory?: string;
  }) {
    const outputDir =
      directory ?? path.join(this.cwd, this.cliConfig.components_directory!);
    const componentsMap = await this.componentsMap.readMap();

    const {
      components: generatedFiles,
      componentsMap: newComponentsMap,
      previousVersions,
    } = await this.api.pullGeneratedComponentsCode({
      components,
      componentsMap,
    });

    return bluebird.map(generatedFiles, async (f) => {
      f.file.name = `${f.file.name}.tsx`;
      const newContent = await this.fs.prettierFormat(f.file.content);

      const newFilePath = newComponentsMap[f.name].path;
      const fileExists = await this.fs.exists(newComponentsMap[f.name].path);
      const previousVersion = previousVersions?.[f.name];

      // Only attempt merge if both conditions are met:
      // 1. File exists on disk
      // 2. We have a previous version from the server
      if (fileExists && previousVersion) {
        try {
          // Perform three-way merge
          const mergedContent = await this.mergeComponentFile({
            component: f,
            previousVersion,
            newContent,
          });

          f.file.content = await this.fs.prettierFormat(mergedContent);

          logger.info(
            `updated component ${f.name} and rebased your changes to the server version`
          );
        } catch (error) {
          logger.warn(
            `Failed to merge changes for component ${f.name}, using new version. You will have to merge manually.`
          );
        }
      } else if (fileExists) {
        // File exists on disk but no previous version in DB
        // This means it's the first time we're syncing this component
        logger.info(
          `Overwriting existing file for component ${f.name} as it's not yet tracked in the DB`
        );
      }

      const componentMapFilePath = this.componentsMap.getComponentMapFile();
      const componentMapFileDir = path.resolve(
        componentMapFilePath,
        path.parse(newFilePath).dir
      );
      logger.info(
        `writing component ${f.name} to ${componentMapFilePath}. Writing to ${componentMapFileDir}`
      );

      await this.fs.writeAsset({
        directory: path.resolve(
          componentMapFilePath,
          path.parse(newFilePath).dir
        ),
        files: [f.file],
      });

      return {
        directory: outputDir,
        files: [f.file],
      };
    });

    // Write the new components map to disk
    await this.componentsMap.writeMap(newComponentsMap);
  }

  public async pullDesignTokens(
    reload = false,
    directory?: string
  ): Promise<Asset[]> {
    const tokens = await this.api.pullDesignTokens();

    const parsedTokenSets = parseRawTokenSets(tokens);

    if (reload) {
      this.reloadTokens(parsedTokenSets);
    }

    return [
      {
        directory:
          directory ?? path.join(this.cwd, this.cliConfig.tokens_directory!),
        files: [
          ...(await bluebird.map(
            Object.keys(parsedTokenSets),
            async (tokenSetName) => {
              return {
                name: `${tokenSetName}.ts`,
                content: await this.fs.prettierFormat(outdent`
  /** 
  * This file is generated by Jux. For more information on how to use this file, visit https://jux.io/docs 
  */
  
  export const ${tokenSetName} = ${JSON.stringify(parsedTokenSets[tokenSetName], null, 2)};
`),
              };
            }
          )),
          {
            name: 'index.ts',
            content: await this.fs.prettierFormat(outdent`
            ${Object.keys(parsedTokenSets)
              .map((tokenSetName) => `export * from './${tokenSetName}';`)
              .join('\n')}
          `),
          },
        ],
      },
    ];
  }

  public async generateAssets(directory?: string): Promise<Asset[]> {
    return [...(await this.generateTokensDefinitions(directory))];
  }

  public async pullAssets(options: PullAssetsOptions): Promise<Asset[]> {
    return [
      ...(await this.pullComponents({
        components: options.components,
      })),
      ...(await this.pullDesignTokens()),
    ];
  }

  async reloadConfigFile(cb: () => Promise<void>): Promise<boolean> {
    const config = await loadCliConfig({
      cwd: this.cwd,
    });

    if (!config) {
      throw new ConfigNotFoundError(this.cwd);
    }

    if (hash(config.cliConfig) === hash(this.cliConfig)) {
      // No need to reload
      return false;
    }

    await cb();

    return true;
  }

  public getFilesToWatch() {
    return this.fs.glob({
      include: [...(this.cliConfig.include ?? [])],
      exclude: this.cliConfig.exclude ? [...this.cliConfig.exclude] : [],
    });
  }
}
