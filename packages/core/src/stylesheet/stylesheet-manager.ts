import postcss from 'postcss';
import cssnano from 'cssnano';
import cssbeautify from 'cssbeautify';
import { generateResetStyles } from './generate-reset-styles.ts';
import { convertObjectToCSS } from './style-object-to-css-string.ts';
import { stringifyCssObject, TokensManager } from '../tokens';
import { GoogleFont, googleFonts } from '../config/builtin-fonts.ts';

export const LAYERS = ['juxbase', 'juxtokens', 'juxutilities'] as const;

type Layers = Record<(typeof LAYERS)[number], postcss.AtRule>;

interface StylesheetManagerOptions {
  cssVarsRoot?: string;
  tokensManager: TokensManager;
  preflight: boolean;
}

export class StylesheetManager {
  public readonly cssVarsRoot: string;
  public readonly preflight: boolean;
  public readonly layers: Layers = {} as Layers;
  public readonly tokensManager: TokensManager;

  constructor(options: StylesheetManagerOptions) {
    this.cssVarsRoot = options.cssVarsRoot ?? ':root';
    this.preflight = options.preflight ?? true;
    this.tokensManager = options.tokensManager;

    LAYERS.forEach((layer) => {
      this.layers[layer] = postcss.atRule({
        name: 'layer',
        params: layer,
        nodes: [],
      });
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

  async appendBaseStyles() {
    if (this.preflight) {
      this.layers.juxbase.append(convertObjectToCSS(generateResetStyles()));
    }

    if (!this.tokensManager.isEmpty) {
      this.layers.juxtokens.append(await this.generateTokenStyles());
      this.layers.juxtokens.append(await this.generateThemeStyles());
    }
  }
}
