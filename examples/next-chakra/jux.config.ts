import { defineConfig } from '@juxio/cli';
import { core } from './src/jux/tokens/core';
import { dark, light } from './src/jux/tokens';

export default defineConfig({
  /* Whether to apply preflight styles */
  preflight: false,

  /* A list of glob file patterns to watch for styling configurations */
  include: [
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],

  exclude: [],

  globalCss: {},

  /* The core tokens */
  core_tokens: core,

  definitions_directory: './src/jux/types',

  /* The tokens and themes for the design system */
  themes: {
    light,
    dark,
  },
});
