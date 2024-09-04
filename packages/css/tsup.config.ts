import { defineConfig, Options } from 'tsup';

const PROCESSOR_FILES = ['css'];

const BASE_CONFIG: Options = {
  name: '@juxio/css',
  tsconfig: './tsconfig.json',
  format: ['cjs', 'esm'],
  splitting: true,
  sourcemap: false,
  treeshake: true,
  cjsInterop: true,
  dts: true,
  clean: true,
  external: ['react'],
  loader: {
    '.js': 'jsx',
  },
};

export default defineConfig([
  {
    ...BASE_CONFIG,
    entry: ['./src/index.ts', './src/tokens.ts'],
  },
  {
    ...BASE_CONFIG,
    entry: PROCESSOR_FILES.map((file) => `./src/processors/${file}.ts`),
    outDir: 'processors/dist',
  },
]);
