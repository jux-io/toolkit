import { loadConfig, type LoadConfigRes } from './load-config';
import bluebird from 'bluebird';
import { JuxAPI } from '../api';
import { type Asset } from '../assets';
import { type JuxCLIConfig, type Themes } from './config.types';
import { Config } from '@oclif/core';
import path from 'path';
import { FileManager } from '../fs';
import { TokensManager } from '../tokens';
import { arrayToUnionType, capitalize } from '../utils';
import { outdent } from 'outdent';
import { StylesheetManager } from '../stylesheet';
import { parseRawTokenSets } from '../utils/parse-raw-token-sets';
import camelCase from 'lodash/camelCase';
import { TSConfig } from 'pkg-types';
import fastDeepEqual from 'fast-deep-equal';
import { ConfigNotFoundError } from '../utils/exceptions';

interface PullAssetsOptions {
  components: string[];
}

export class JuxContext {
  /**
   * Responsible for parsing and managing tokens
   */
  public tokens: TokensManager;

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
  private readonly configPath: string;

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

  constructor(config: LoadConfigRes) {
    this.tokens = new TokensManager({
      core: config.cliConfig.core_tokens,
      ...config.cliConfig.themes,
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

  public async generateTokensDefinitions(): Promise<Asset[]> {
    const set = new Set<string>();

    set.add(`import '@juxio/react-styled/tokens';`);

    for (const [name, token] of this.tokens.getTokensByCategory()) {
      set.add(
        `export type ${capitalize(name)}Token = ${arrayToUnionType(
          // Remove duplicates
          Array.from(new Set(token.map((t) => `{${t.finalizedTokenName}}`)))
        )};`
      );
    }

    set.add(`declare module '@juxio/react-styled/tokens' {
          export interface Tokens {
              ${Array.from(this.tokens.getTokensByCategory().keys())
                .map((name) => {
                  return `${camelCase(name)}: ${capitalize(name)}Token;`;
                })
                .join('\n')}
      }
    }`);

    return [
      {
        directory: path.join(this.cwd, this.cliConfig.definitions_directory),
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

  public async pullGeneratedComponentsCode(
    components: string[]
  ): Promise<Asset[]> {
    if (!this.cliConfig.components_directory) {
      throw new Error('components_directory is not defined in jux.config.ts');
    }

    const generatedFiles =
      await this.api.pullGeneratedComponentsCode(components);

    return bluebird.map(generatedFiles, async (f) => {
      f.file.name = `${f.file.name}.tsx`;
      f.file.content = await this.fs.prettierFormat(f.file.content);
      return {
        directory: path.join(
          this.cwd,
          // @ts-expect-error - we checked above if this.cliConfig.components_directory is defined
          this.cliConfig.components_directory
        ),
        files: [f.file],
      };
    });
  }

  public async pullDesignTokens(reload = false): Promise<Asset[]> {
    if (!this.cliConfig.tokens_directory) {
      throw new Error('tokens_directory is not defined in jux.config.ts');
    }

    const tokens = await this.api.pullDesignTokens();

    const parsedTokenSets = parseRawTokenSets(tokens);

    if (reload) {
      this.reloadTokens(parsedTokenSets);
    }

    return [
      {
        directory: path.join(this.cwd, this.cliConfig.tokens_directory),
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

  public async generateAssets(): Promise<Asset[]> {
    return [...(await this.generateTokensDefinitions())];
  }

  public async pullAssets(options: PullAssetsOptions): Promise<Asset[]> {
    return [...(await this.pullGeneratedComponentsCode(options.components))];
  }

  async reloadConfigFile(cb: () => Promise<void>): Promise<boolean> {
    const config = await loadConfig({ cwd: this.cwd }, true);

    if (!config) {
      throw new ConfigNotFoundError(this.cwd);
    }

    if (fastDeepEqual(config.cliConfig, this.cliConfig)) {
      // No need to reload
      return false;
    }

    await cb();

    return true;
  }

  public getFilesToWatch() {
    return this.fs.glob({
      include: [...this.cliConfig.include],
      exclude: this.cliConfig.exclude ? [...this.cliConfig.exclude] : [],
    });
  }
}
