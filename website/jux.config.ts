import { defineConfig } from '@juxio/cli';

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
  core_tokens: {
    color: {
      brand_100: {
        $value: '#0070f3',
        $description: 'Primary brand color',
      },
      brand_200: {
        $value: '#ff0080',
        $description: 'Secondary brand color',
      },
    },
    dimension: {
      spacing_1: {
        $value: '0.25rem',
      },
      spacing_2: {
        $value: '0.5rem',
      },
      spacing_3: {
        $value: '0.75rem',
      },
      spacing_4: {
        $value: '1rem',
      },
      spacing_5: {
        $value: '1.25rem',
      },
    },
  },

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
            $value: '{core.dimension.spacing_1}',
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
            $value: '{core.dimension.spacing_1}',
            $description: 'Button border radius',
          },
        },
      },
    },
  },
});
