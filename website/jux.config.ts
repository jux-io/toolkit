import { defineConfig } from '@juxio/cli';
import * as tokens from './src/design-tokens';

export default defineConfig({
  /* Whether to apply preflight styles */
  preflight: true,

  /* A list of glob file patterns to watch for styling configurations */
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  exclude: [],

  globalCss: {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
  },

  components_directory: './src/components',

  tokens_directory: './src/design-tokens',

  /* The core tokens */
  core_tokens: tokens.core,

  definitions_directory: './src/jux/types',

  /* The tokens and themes for the design system */
  themes: {
    light: {
      color: {
        primary: {
          $value: '{core.color.brand_100}',
          $description: 'Primary color',
        },
      },
      dimension: {
        specific: {
          button_radius: {
            $value: '{core.dimension.spacing_100}',
            $description: 'Button border radius',
          },
        },
      },
    },
    dark: {
      color: {
        primary: {
          $value: '{core.color.brand_200}',
          $description: 'Primary color',
        },
      },
      dimension: {
        specific: {
          button_radius: {
            $value: '{core.dimension.spacing_100}',
            $description: 'Button border radius',
          },
        },
      },
    },
  },
});
