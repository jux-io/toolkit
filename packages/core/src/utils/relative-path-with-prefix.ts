export function relativePathWithPrefix(relativePath: string) {
  if (relativePath.startsWith('.')) {
    return relativePath;
  }
  return `./${relativePath}`;
}
