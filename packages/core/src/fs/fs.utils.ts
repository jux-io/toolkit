import * as prettier from 'prettier';

export const prettierFormat = async (content: string) =>
  prettier.format(content, {
    ...(await prettier.resolveConfig(process.cwd())),
    parser: 'typescript',
  });
