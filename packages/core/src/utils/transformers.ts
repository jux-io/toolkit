import { promises as fs } from 'fs';
import path from 'path';
import { Project, ScriptKind, type SourceFile, SyntaxKind } from 'ts-morph';
import { tmpdir } from 'os';
import { type JuxCliConfigOptions } from '../config';
import { transformJsx } from './transform-jsx';

export interface TransformOpts {
  filename: string;
  content: string;
  config: JuxCliConfigOptions;
}

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile;
  }
) => Promise<Output>;

export const transformRsc: Transformer = async ({ sourceFile, config }) => {
  if (config.rsc) {
    return sourceFile;
  }

  // Remove "use client" from the top of the file.
  const first = sourceFile.getFirstChildByKind(SyntaxKind.ExpressionStatement);
  if (first?.getText() === `"use client"`) {
    first.remove();
  }

  return sourceFile;
};

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'));
  return path.join(dir, filename);
}

const project = new Project({
  compilerOptions: {},
});

const transformers: Transformer[] = [transformRsc];

export async function transform(opts: TransformOpts) {
  const tempFile = await createTempSourceFile(opts.filename);
  const sourceFile = project.createSourceFile(tempFile, opts.content, {
    scriptKind: ScriptKind.TSX,
  });

  for (const transformer of transformers) {
    transformer({ sourceFile, ...opts });
  }

  return transformJsx({
    sourceFile,
    ...opts,
  });
}
