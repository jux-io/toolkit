import { defineConfig } from 'tsup';

export default defineConfig([
  {
    name: '@juxio/react-styled',
    entry: ['./src/index.ts', './src/tokens.ts'],
    tsconfig: './tsconfig.json',
    format: ['cjs', 'esm'],
    splitting: true,
    sourcemap: true,
    cjsInterop: true,
    treeshake: true,
    dts: true,
    clean: true,
    external: ['react'],
  },
]);
