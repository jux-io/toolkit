import { SourceFile } from 'ts-morph';
import { JUX_FUNCTIONS } from './file-parser.ts';

export const JUX_STYLED_PACKAGES = {
  react: '@juxio/react-styled',
};

export interface ImportDescriptor {
  name: string;
  alias: string;
  module: string;
  kind: 'named' | 'namespace';
}

function matcher(modules: string[], values: string[]) {
  const regex = values ? new RegExp(`^(${values.join('|')})$`) : /.*/;
  const match = (value: string) => regex.test(value);
  return { modules, regex, match };
}

export function isJuxImport(result: ImportDescriptor, juxPath: string[]) {
  const { regex, modules } = matcher(juxPath, [
    JUX_FUNCTIONS.CSS,
    JUX_FUNCTIONS.STYLED,
  ]);

  if (result.kind !== 'namespace' && !regex.test(result.name)) return false;

  return modules.some((m) => result.module.includes(m));
}

export function getImportsFromFile(
  sourceFile: SourceFile,
  juxPath: string[]
): ImportDescriptor[] {
  const imports: ImportDescriptor[] = [];

  sourceFile.getImportDeclarations().forEach((node) => {
    // Example: For import settings from "./settings"; would return ./settings
    const module = node.getModuleSpecifierValue();

    // import * as jux from '@juxio/styled';
    const namespace = node.getNamespaceImport();
    if (namespace) {
      const name = namespace.getText();

      const result: ImportDescriptor = {
        name,
        alias: name,
        module,
        kind: 'namespace',
      };

      if (isJuxImport(result, juxPath)) {
        imports.push(result);
      }
    }

    // import { styled } from '@juxio/styled';
    // import { styled as juxStyled } from '@juxio/styled';
    node.getNamedImports().forEach((specifier) => {
      const name = specifier.getNameNode().getText();
      const alias = specifier.getAliasNode()?.getText() || name;

      const result: ImportDescriptor = { name, alias, module, kind: 'named' };

      if (isJuxImport(result, juxPath)) {
        imports.push(result);
      }
    });
  });

  return imports;
}
