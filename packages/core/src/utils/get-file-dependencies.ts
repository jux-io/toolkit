import { TSConfig } from 'pkg-types';
import fs from 'fs';
import path, { posix, sep } from 'path';
import ts from 'typescript';
import { omit } from 'lodash';

// adapted from

const jsExtensions = ['.js', '.cjs', '.mjs'];

const jsResolutionOrder = [
  '',
  '.js',
  '.cjs',
  '.mjs',
  '.ts',
  '.cts',
  '.mts',
  '.jsx',
  '.tsx',
];
const tsResolutionOrder = [
  '',
  '.ts',
  '.cts',
  '.mts',
  '.tsx',
  '.js',
  '.cjs',
  '.mjs',
  '.jsx',
];

const importRegex = /import[\s\S]*?['"](.{3,}?)['"]/gi;
const importFromRegex = /import[\s\S]*from[\s\S]*?['"](.{3,}?)['"]/gi;
const requireRegex = /require\(['"`](.+)['"`]\)/gi;
const exportRegex = /export\s*[\s\S]*?\s*from\s*['"](.{3,}?)['"];?/gi;

export interface ConfigTsOptions {
  baseUrl?: string | undefined;
  pathMappings: PathMapping[];
}

export interface GetDependenciesOptions {
  filename: string;
  ext: string;
  projectCwd: string;
  cwd: string;
  seen: Set<string>;
  baseUrl: string | undefined;
  pathMappings: PathMapping[];
  foundModuleAliases: Map<string, string>;
  compilerOptions?: TSConfig['compilerOptions'];
}

export interface PathMapping {
  pattern: RegExp;
  paths: string[];
}

const resolveTsPathPattern = (
  pathMappings: PathMapping[],
  moduleSpecifier: string
) => {
  for (const mapping of pathMappings) {
    const match = moduleSpecifier.match(mapping.pattern);
    if (!match) {
      continue;
    }
    for (const pathTemplate of mapping.paths) {
      let starCount = 0;
      const mappedId = pathTemplate.replace(/\*/g, () => {
        // There may exist more globs in the path template than in
        // the match pattern. In that case, we reuse the final
        // glob match.
        const matchIndex = Math.min(++starCount, match.length - 1);
        return match[matchIndex];
      });

      return mappedId.split(sep).join(posix.sep);
    }
  }
};

function resolveWithExtension(file: string, extensions: string[]) {
  // Try to find `./a.ts`, `./a.js`, ... from `./a`
  for (const ext of extensions) {
    const full = `${file}${ext}`;
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      return full;
    }
  }

  // Try to find `./a/index.js` from `./a`
  for (const ext of extensions) {
    const full = `${file}/index${ext}`;
    if (fs.existsSync(full)) {
      return full;
    }
  }

  return null;
}

function getDependencies(options: GetDependenciesOptions, fromAlias?: string) {
  const { filename, seen } = options;

  const compilerOptions = omit(options.compilerOptions ?? {}, [
    'moduleResolution',
  ]);

  // Try to find the file
  const absoluteFile = resolveWithExtension(
    path.resolve(options.cwd, filename),
    jsExtensions.includes(options.ext) ? jsResolutionOrder : tsResolutionOrder
  );

  if (absoluteFile === null) return; // File doesn't exist

  if (fromAlias) {
    options.foundModuleAliases.set(fromAlias, absoluteFile);
  }

  if (absoluteFile.includes('node_modules')) return;

  // If we've already seen this file, don't process it again
  if (seen.size > 1 && seen.has(absoluteFile)) return;

  seen.add(absoluteFile);

  const contents = fs.readFileSync(absoluteFile, 'utf-8');

  const fileDeps = [
    ...contents.matchAll(importRegex),
    ...contents.matchAll(importFromRegex),
    ...contents.matchAll(requireRegex),
    ...contents.matchAll(exportRegex),
  ];

  if (!fileDeps.length) return; // No dependencies found

  const nextOptions: Omit<GetDependenciesOptions, 'filename'> = {
    cwd: path.dirname(absoluteFile),
    ext: path.extname(absoluteFile),
    projectCwd: options.projectCwd,
    seen,
    foundModuleAliases: options.foundModuleAliases,
    baseUrl: options.baseUrl,
    pathMappings: options.pathMappings,
  };

  fileDeps.forEach((match) => {
    const moduleSpecifier = match[1];

    if (moduleSpecifier[0] === '.') {
      getDependencies({
        // might be wrong
        ...nextOptions,
        filename: moduleSpecifier,
      });
    }

    try {
      const found = ts.resolveModuleName(
        moduleSpecifier,
        absoluteFile,
        compilerOptions,
        ts.sys
      ).resolvedModule;

      if (found && found.extension.endsWith('ts')) {
        getDependencies({
          ...nextOptions,
          filename: found.resolvedFileName,
        });
      }

      if (!options.pathMappings) return;

      const filename = resolveTsPathPattern(
        options.pathMappings,
        moduleSpecifier
      );

      if (!filename) return;

      getDependencies(
        {
          ...nextOptions,
          filename,
        },
        moduleSpecifier
      );
    } catch (error) {
      /* empty */
    }
  });
}

export function getFileDependencies(
  filePath: string,
  projectCwd: string,
  tsOptions: ConfigTsOptions = { pathMappings: [] },
  compilerOptions?: TSConfig['compilerOptions']
) {
  const deps = new Set<string>();
  const aliases = new Map<string, string>();

  deps.add(filePath);

  getDependencies({
    filename: filePath,
    ext: path.extname(filePath),
    cwd: path.dirname(filePath),
    seen: deps,
    baseUrl: tsOptions.baseUrl,
    pathMappings: tsOptions.pathMappings ?? [],
    foundModuleAliases: aliases,
    projectCwd,
    compilerOptions,
  });

  return { deps, aliases };
}
