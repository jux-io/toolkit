import { calculateHash } from './utils/calculate-hash';

export default function css(styles) {
  return `j${calculateHash(JSON.stringify(styles)).slice(0, 6)}`;
}
