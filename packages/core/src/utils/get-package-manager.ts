import { detect } from '@antfu/ni';

export async function getPackageManager(
  targetDir: string
): Promise<'yarn' | 'pnpm' | 'bun' | 'npm'> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir });

  if (packageManager === 'yarn@berry' || packageManager === 'yarn')
    return 'yarn';
  if (packageManager === 'pnpm@6' || packageManager === 'pnpm') return 'pnpm';
  if (packageManager === 'bun') return 'bun';

  return packageManager ?? 'npm';
}
