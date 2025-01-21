import { createSystem, defaultConfig } from '@chakra-ui/react';

const breakpoints = {
  sm: { value: '40em' },
  md: { value: '52em' },
  lg: { value: '64em' },
  xl: { value: '80em' },
};

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        text: {
          base: { value: '#16161D' },
          dark: { value: '#ade3b8' },
        },
        heroGradientStart: {
          base: { value: '#7928CA' },
          dark: { value: '#e3a7f9' },
        },
        heroGradientEnd: {
          base: { value: '#FF0080' },
          dark: { value: '#fbec8f' },
        },
        black: { value: '#16161D' },
      },
      radii: {
        button: { value: '12px' },
      },
      fonts: {
        mono: { value: `'Menlo', monospace` },
      },
      breakpoints,
    },
  },
});
