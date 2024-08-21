import postcss from 'postcss';
import cssnano from 'cssnano';
import cssbeautify from 'cssbeautify';
import { generateResetStyles } from './generate-reset-styles';
import { convertObjectToCSS } from './style-object-to-css-string';
import { formatTokenValue, stringifyCssObject, TokensManager } from '../tokens';
import { GoogleFont, googleFonts } from '../config';
import { JuxCLIConfig } from '../config';
import { colorScheme, logger, walkObject } from '../utils';
import { getAliasMatches, isAlias } from '@juxio/design-tokens';

export const LAYERS = ['juxbase', 'juxtokens', 'juxutilities'] as const;

type Layers = Record<(typeof LAYERS)[number], postcss.AtRule>;

interface StylesheetManagerOptions {
  cssVarsRoot?: string;
  tokensManager: TokensManager;
  preflight: boolean;
  globalCss?: JuxCLIConfig['globalCss'];
}

export class StylesheetManager {
  public readonly cssVarsRoot: string;
  public readonly preflight: boolean;
  private readonly globalCss: JuxCLIConfig['globalCss'];
  public readonly layers: Layers = {} as Layers;
  public readonly tokensManager: TokensManager;

  private fileClasses = new Map<
    string,
    {
      className: string;
      cssText: string;
    }[]
  >();

  constructor(options: StylesheetManagerOptions) {
    this.cssVarsRoot = options.cssVarsRoot ?? ':root';
    this.preflight = options.preflight ?? true;
    this.tokensManager = options.tokensManager;
    this.globalCss = options.globalCss;

    LAYERS.forEach((layer) => {
      this.layers[layer] = postcss.atRule({
        name: 'layer',
        params: layer,
        nodes: [],
      });
    });
  }

  async appendClassName(
    fileName: string,
    layer: (typeof LAYERS)[number],
    className: string,
    cssText: string
  ) {
    const beautifiedCss = await this.beautifyCss(cssText);

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
    }
  }

  removeClassNames(layer: (typeof LAYERS)[number], classNames: string[]) {
    const rule = this.layers[layer];

    rule.walkRules((rule) => {
      if (classNames.includes(rule.selector)) {
        rule.remove();
      }
    });
  }

  async beautifyCss(css: string) {
    return postcss([
      cssnano({
        preset: ['default', {}],
      }),
    ])
      .process(css, { from: undefined })
      .then((result) => cssbeautify(result.css));
  }

  generateTokenStyles(): Promise<string> {
    const results: string[] = [];

    const coreTokens = this.tokensManager.getCoreTokens();

    const coreTokensView = Object.fromEntries(coreTokens.view);

    results.push(
      stringifyCssObject({
        [this.cssVarsRoot]: coreTokensView,
      })
    );

    return this.beautifyCss(results.join('\n\n'));
  }

  generateCoreCompositeClasses(): Promise<string> {
    const results: string[] = [];

    const coreCompositeTokens = this.tokensManager.getCoreCompositeTokens();

    for (const [className, themeTokensView] of Object.entries(
      coreCompositeTokens.view
    )) {
      const css = stringifyCssObject({
        [className]: themeTokensView,
      });

      results.push(css);
    }

    return this.beautifyCss(results.join('\n\n'));
  }

  async generateThemeStyles(): Promise<string> {
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

    return this.beautifyCss(results.join('\n\n'));
  }

  async generateThemeCompositeClasses(): Promise<string> {
    const results: string[] = [];

    const themeCompositeTokens = this.tokensManager.getThemesCompositeTokens();

    for (const [themeName, themeTokensView] of Object.entries(
      themeCompositeTokens.view
    )) {
      const css = stringifyCssObject({
        [`& [data-jux-theme="${themeName}"]`]: themeTokensView,
      });

      results.push(css);
    }

    return this.beautifyCss(results.join('\n\n'));
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
    return walkObject(this.globalCss, (key, value) => {
      if (typeof value === 'string' && isAlias(value)) {
        const { valuePath } = getAliasMatches(value);
        const token = this.tokensManager.tokensMap.get(valuePath);

        if (!token) {
          logger.warn(
            `Token value "${colorScheme.input(value)}" was not found in global styles configuration. Skipping...`
          );
          return {
            type: 'remove',
          };
        }

        if (token.isComposite) {
          logger.warn(
            `Token value "${colorScheme.input(value)}" is a composite token and cannot be used in global styles configuration. Skipping...`
          );
          return {
            type: 'remove',
          };
        }

        return {
          type: 'replace',
          key,
          value: formatTokenValue(valuePath),
        };
      }

      return { type: 'replace', value };
    });
  }

  async appendBaseStyles() {
    if (this.preflight) {
      this.layers.juxbase.append(convertObjectToCSS(generateResetStyles()));
    }

    if (this.globalCss) {
      this.layers.juxbase.append(
        convertObjectToCSS(this.processGlobalStyles())
      );
    }

    if (!this.tokensManager.isEmpty) {
      this.layers.juxtokens.append(await this.generateTokenStyles());
      this.layers.juxtokens.append(await this.generateThemeStyles());
    }
  }
}
