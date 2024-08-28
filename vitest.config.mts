import { defineConfig } from 'vitest/config';
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
      include: ['packages/cli/**/*.ts', 'packages/design-tokens/**/*.ts'],
      exclude: ['node_modules'],
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
