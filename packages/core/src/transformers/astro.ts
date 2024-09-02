import { transform } from '@astrojs/compiler';
import { transformWithEsbuild } from 'vite';
import findUp from 'escalade/sync';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'path';

export async function transformAstro(
  content: string,
  filePath: string,
  cwd: string
) {
  let filename = filePath;
  const transformedResult = await transform(content, {
    compact: true,
    renderScript: false,
    filename: filePath,
    sourcemap: false,
    internalURL: 'astro/compiler-runtime',
  });

  const esbuildResult = await transformWithEsbuild(
    transformedResult.code,
    filePath,
    {
      loader: 'ts',
      sourcemap: false,
      target: 'esnext',
      tsconfigRaw: {
        compilerOptions: {
          // Ensure client:only imports are treeshaken
          verbatimModuleSyntax: false,
          importsNotUsedAsValues: 'remove',
        },
      },
    }
  );

  const nodeModulesPath = findUp(cwd, (_, paths) =>
    paths.find((file) => file === 'node_modules')
  );

  if (nodeModulesPath) {
    mkdirSync(path.join(nodeModulesPath, '.juxio'), { recursive: true });

    filename = path.join(
      nodeModulesPath,
      '.juxio',
      `${path.basename(filePath)}_${Math.random()}.ts`
    );

    writeFileSync(filename, esbuildResult.code, 'utf-8');
  }

  return { code: esbuildResult.code, filePath: filename };
}
