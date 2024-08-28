import { defineWorkspace, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// export default defineWorkspace([
//   {
//     plugins: [tsconfigPaths()],
//     resolve: {
//       alias: {},
//     },
//     // add "extends" to merge two configs together
//     test: {
//       globals: true,
//       pool: 'forks',
//       setupFiles: [],
//       include: ['packages/cli/**/*.test.{ts,js}'],
//       // it is recommended to define a name when using inline configs
//       name: 'CLI',
//       environment: 'node',
//     },
//   },
// ]);

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {},
  },
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['packages/cli/**/*.ts'],
      exclude: ['node_modules'],
      reportsDirectory: 'coverage',
    },
    watch: false,
    setupFiles: ['packages/cli/tests/setup.ts'],
    include: ['**/*.test.{ts,js}'],
    // it is recommended to define a name when using inline configs
    name: 'CLI',
    environment: 'node',
  },
});
