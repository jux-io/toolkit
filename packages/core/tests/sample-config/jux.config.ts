import { JuxCLIConfig } from '../../src';

export default {
  /* Whether to apply preflight styles */
  preflight: true,

  /* A list of glob file patterns to watch for styling configurations */
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{ts,tsx}'],

  exclude: [],

  screens: {
    desktop: {
      min: '768px',
      max: '1024px',
    },
    mobile: {
      max: '767px',
    },
    tablet: '40rem',
    custom_screen: {
      raw: '@media (orientation: landscape)',
    },
  },

  utilities: {
    mx: {
      transform: (value: string[]) => {
        return {
          marginLeft: value,
          marginRight: value,
        };
      },
    },
  },

  globalCss: {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      backgroundColor: '{core.color.brand_100}',
      color: '{does-not-exist}',
      marginTop: '{some-weird-token-with+-special-chars!}',
      top: 'var(--wow)',
    },
    'html, body': {
      fontFamily: 'Inter',
      fontSize: '16px',
      color: '#111827',
      backgroundColor: '#FFF',
    },
    body: {
      tablet: {
        backgroundColor: 'red',
      },
      desktop: {
        backgroundColor: '{core.color.brand_200}',
        mx: '12px',
      },
      mobile: {
        backgroundColor: '{core.color.brand_100}',
        typography: '{core.typography.12_bold}',
        mx: '{core.dimension.spacing_100}',
      },
      custom_screen: {
        margin: '{color.primary}',
        typography: '{typography.header}',
        mx: '{non-existent}',
      },
    },
  },

  builtInFonts: {
    google: ['Inter', 'Roboto'],
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
      typography: {
        header: {
          $value: {
            fontSize: '{core.dimension.spacing_100}',
            fontFamily: 'Inter',
            fontWeight: '700',
            lineHeight: '16px',
            letterSpacing: '12px',
          },
        },
      },
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
      typography: {
        header: {
          $value: {
            fontSize: '{core.dimension.spacing_100}',
            fontFamily: 'Inter',
            fontWeight: '700',
            lineHeight: '16px',
            letterSpacing: '12px',
          },
        },
      },
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
} satisfies JuxCLIConfig;
