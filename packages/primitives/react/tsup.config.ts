import { defineConfig } from 'tsup';

export default defineConfig({
  name: '@juxio/react-primitives',
  entry: ['./src/index.ts', './src/primitives/index.ts'],
  tsconfig: './tsconfig.json',
  format: ['cjs', 'esm'],
  cjsInterop: true,
  splitting: false,
  dts: true,
  shims: true,
  clean: true,
});
