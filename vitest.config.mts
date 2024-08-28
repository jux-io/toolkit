import { defineConfig, defaultExclude } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {},
  },
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['packages/**/*.ts'],
      exclude: [...defaultExclude],
      reportsDirectory: 'coverage',
    },
    watch: false,
    silent: true,
    setupFiles: [],
    include: ['**/*.test.{ts,js}'],
    // it is recommended to define a name when using inline configs
    name: 'JUX',
    environment: 'node',
  },
});
