import { defineConfig } from '@juxio/cli';
import * as tokens from './src/tokens';

export default defineConfig({
  /* Whether to apply preflight styles */
  preflight: false,

  /* A list of glob file patterns to watch for styling configurations */
  include: ['./src/**/*.{ts,tsx,js,jsx}', '**/styling/index.mdx'],

  exclude: ['./src/**/samples/**/*.{ts,tsx,js,jsx,astro}'],

  builtInFonts: {
    google: ['Inter'],
  },

  /* The core tokens */
  core_tokens: tokens.core,

  definitions_directory: './src/jux/types',

  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  /* The tokens and themes for the design system */
  themes: {
    light: tokens.light,
    dark: tokens.dark,
  },
});
