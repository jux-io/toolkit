import postcss from 'postcss';
import { browserslistToTargets, transform } from 'lightningcss';
import { generateResetStyles } from './generate-reset-styles';
import { stringifyCssObject, TokensManager } from '../tokens';
import { GoogleFont, googleFonts } from '../config';
import { JuxCLIConfig } from '../config';
import { colorScheme, logger, parseRawStyleObject } from '../utils';
import { UtilitiesManager } from '../utilities';
import { ConditionsManager } from '../conditions';

export const LAYERS = ['juxbase', 'juxtokens', 'juxutilities'] as const;

type Layers = Record<(typeof LAYERS)[number], postcss.AtRule>;

interface StylesheetManagerOptions {
  cssVarsRoot?: string;
  tokensManager: TokensManager;
  utilitiesManager: UtilitiesManager;
  conditionsManager: ConditionsManager;
  preflight: boolean;
  globalCss?: JuxCLIConfig['globalCss'];
  browserslist?: JuxCLIConfig['browserslist'];
}

export class StylesheetManager {
  public readonly cssVarsRoot: string;
  public readonly preflight: boolean;
  private readonly globalCss: JuxCLIConfig['globalCss'];
  private readonly browserslist: JuxCLIConfig['browserslist'];
  public readonly layers: Layers = {} as Layers;
  private readonly tokensManager: TokensManager;
  private readonly utilitiesManager: UtilitiesManager;
  private readonly conditionsManager: ConditionsManager;

  private fileClasses = new Map<
    string,
    {
      className: string;
      cssText: string;
    }[]
  >();

  constructor(options: StylesheetManagerOptions) {
    this.cssVarsRoot = options.cssVarsRoot ?? ':where(:root, :host)';
    this.preflight = options.preflight ?? true;
    this.tokensManager = options.tokensManager;
    this.utilitiesManager = options.utilitiesManager;
    this.conditionsManager = options.conditionsManager;
    this.globalCss = options.globalCss;
    this.browserslist = options.browserslist;

    LAYERS.forEach((layer) => {
      this.layers[layer] = postcss.atRule({
        name: 'layer',
        params: layer,
        nodes: [],
      });
    });
  }

  appendClassName(
    fileName: string,
    layer: (typeof LAYERS)[number],
    className: string,
    cssText: string
  ) {
    const beautifiedCss = this.transformCss(cssText);

    if (!this.fileClasses.has(fileName)) {
      // This is the first time we're adding a class to this file.
      this.fileClasses.set(fileName, [{ className, cssText: beautifiedCss }]);
      this.layers[layer].append(beautifiedCss);

      return;
    }

    // Check if the className already exists in the file. If it does, remove it and append the new one.
    const existingClass = this.fileClasses.get(fileName)!;

    const classInfo = existingClass.find((c) => c.className === className);

    if (!classInfo) {
      // class is not registered yet
      existingClass.push({ className, cssText: beautifiedCss });
      this.layers[layer].append(beautifiedCss);
      return;
    } else {
      // Check if the cssText has changed
      if (classInfo.cssText !== cssText) {
        // Remove the old class and append the new one
        this.layers[layer].walkAtRules((atRule) => {
          if (atRule.params === className) {
            atRule.remove();
          }
        });
        classInfo.cssText = beautifiedCss;
        this.layers[layer].append(beautifiedCss);
      }
    }
  }

  transformCss(css: string): string {
    return transform({
      filename: 'input.css',
      code: Buffer.from(css),
      sourceMap: false,
      minify: process.env.NODE_ENV === 'production',
      targets: this.browserslist
        ? browserslistToTargets(this.browserslist)
        : undefined,
    }).code.toString();
  }

  generateTokenStyles(): string {
    const results: string[] = [];

    const coreTokens = this.tokensManager.getCoreTokens();

    const coreTokensView = Object.fromEntries(coreTokens.view);

    results.push(
      stringifyCssObject({
        [this.cssVarsRoot]: coreTokensView,
      })
    );

    return results.join('\n\n');
  }

  generateThemeStyles(): string {
    const results: string[] = [];

    const themeTokens = this.tokensManager.getThemesTokens();

    for (const [themeName, themeTokensView] of Object.entries(
      themeTokens.view
    )) {
      const css = stringifyCssObject({
        [`& [data-jux-theme="${themeName}"]`]: themeTokensView,
      });
      results.push(css);
    }

    return results.join('\n\n');
  }

  generateGoogleFontsStyles(fontsFamily: GoogleFont['family'][]): string {
    const formattedFonts: string[] = [];
    fontsFamily.forEach((fontFamilyName) => {
      const googleFontFamily = googleFonts.find(
        (gf) => gf.family === fontFamilyName
      );

      if (!googleFontFamily) return;

      const { variants, subsets, family } = googleFontFamily;
      const formattedFamily = family.replace(/\s+/g, '+');
      formattedFonts.push(
        `@import url('https://fonts.googleapis.com/css?family=${formattedFamily}:${variants.join(',')}&subset=${subsets.join(',')}');`
      );
    });

    return formattedFonts.join('\n');
  }

  processGlobalStyles() {
    return parseRawStyleObject({
      tokens: this.tokensManager,
      utilities: this.utilitiesManager,
      conditions: this.conditionsManager,
      baseStyles: this.globalCss || {},
      onTokenNotFound: (cssKey, value, valuePath) => {
        logger.warn(
          `[${colorScheme.debug(`globalCss > ${cssKey}`)}]: Token value ${colorScheme.debug(valuePath)} was not found in ${colorScheme.input(cssKey)}: "${colorScheme.input(value)}"`
        );
      },
      onError: (msg) => {
        logger.warn(`[${colorScheme.debug(`globalCss`)}]: ${msg}`);
      },
    });
  }

  toCss() {
    return this.transformCss(
      Object.values(this.layers)
        .map((layer) => layer.toString())
        .join('\n')
    );
  }

  async appendBaseStyles() {
    if (this.preflight) {
      this.layers.juxbase.append(stringifyCssObject(generateResetStyles()));
    }

    if (this.globalCss) {
      this.layers.juxbase.append(
        stringifyCssObject(this.processGlobalStyles())
      );
    }

    if (!this.tokensManager.isEmpty) {
      this.layers.juxtokens.append(this.generateTokenStyles());
      this.layers.juxtokens.append(this.generateThemeStyles());
    }
  }
}
