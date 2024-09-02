import { defineConfig } from '@juxio/cli';

export default defineConfig({
  /* ... */
  tokens_directory: './src/jux/tokens',

  components_directory: './src/jux/components',

  definitions_directory: './src/jux/types',

  core_tokens: {
    /* Your core tokens */
  },

  themes: {
    light: {
      /* Your light theme */
    },
    dark: {
      /* Your dark theme */
    },
    my_custom_theme: {
      /* Your custom theme */
    },
  },
});
