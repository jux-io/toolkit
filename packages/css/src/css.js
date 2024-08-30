import { calculateHash } from './utils/calculate-hash';

export function css(styles) {
  return `jux-${calculateHash(JSON.stringify(styles)).slice(0, 6)}`;
}
