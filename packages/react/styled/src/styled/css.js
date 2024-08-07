import crypto from 'node:crypto';
import { calculateHash } from './utils/calculate-hash';

export default function css(styles) {
  return `jux-${calculateHash(JSON.stringify(styles)).slice(0, 6)}`;
}
