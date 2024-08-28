import { defineConfig, defaultExclude } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@juxio/cli': path.resolve(__dirname, 'packages/cli/src'),
    },
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
    passWithNoTests: true,
    setupFiles: [],
    include: ['**/*.test.{ts,js}'],
    // it is recommended to define a name when using inline configs
    name: 'JUX',
    environment: 'node',
  },
});
