export default {
  /* Whether to apply preflight styles */
  preflight: true,

  /* A list of glob file patterns to watch for styling configurations */
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{ts,tsx}'],

  exclude: [],

  globalCss: {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
  },

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
    typography: {
      '12_bold': {
        $value: {
          fontSize: '{core.dimension.spacing_100}',
          fontFamily: 'Inter',
          fontWeight: '700',
          lineHeight: '16px',
          letterSpacing: '12px',
        },
        $description: 'Typography test',
      },
    },
    dimension: {
      spacing_100: {
        $value: '8px',
        $description: 'Base spacing unit',
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
        secondary: {
          $value: '#FFF',
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
        secondary: {
          $value: '{dark.color.primary}',
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
};
