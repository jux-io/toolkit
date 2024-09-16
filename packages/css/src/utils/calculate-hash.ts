import sha256 from 'crypto-js/sha256.js';

export function calculateHash(str: string) {
  return sha256(str).toString();
}
