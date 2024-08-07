import { defineConfig } from 'tsup';

export default defineConfig({
  name: '@juxio/postcss',
  entry: ['./src/index.ts'],
  tsconfig: './tsconfig.json',
  format: ['cjs', 'esm'],
  cjsInterop: true,
  splitting: true,
  dts: true,
  shims: true,
  clean: true,
});
