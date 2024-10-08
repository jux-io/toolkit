import { defineConfig, Options } from 'tsup';

const PROCESSOR_FILES = ['styled'];

const BASE_CONFIG: Options = {
  name: '@juxio/react-styled',
  tsconfig: './tsconfig.json',
  format: ['cjs', 'esm'],
  splitting: true,
  sourcemap: true,
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
    entry: ['./src/index.ts'],
  },
  {
    ...BASE_CONFIG,
    entry: PROCESSOR_FILES.map((file) => `./src/processors/${file}.ts`),
    outDir: 'processors/dist',
  },
]);
