// This is the configuration file being used in the test

export default {
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

  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  utilities: {
    fixed_values: {
      acceptedValues: ['some_value', 'another_value'],
      transform: (value) => {
        return {
          color: value,
        };
      },
    },
    token_category: {
      acceptedValues: 'border',
      transform: (value) => {
        return {
          color: value,
        };
      },
    },
  },

  components_directory: './src/jux/components',

  tokens_directory: './src/jux/tokens',

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
};
