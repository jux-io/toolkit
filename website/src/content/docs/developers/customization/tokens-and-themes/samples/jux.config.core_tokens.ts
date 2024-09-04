import { defineConfig } from '@juxio/cli';

export default defineConfig({
  /* ... */
  core_tokens: {
    color: {
      primary: { $value: '#007bff', $description: 'Primary brand color' },
      secondary: { $value: '#6c757d', $description: 'Secondary brand color' },
      i_am_nested: {
        nested: {
          $value: '#6c757d',
          $description: 'Nested color',
        },
      },
    },
    dimension: {
      small: { $value: '8px' },
      medium: { $value: '16px' },
    },
    typography: {
      body: {
        $value: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '400',
          lineHeight: '16',
          letterSpacing: 'normal',
        },
        $description: 'This should be the body font',
      },
    },
  },
});
