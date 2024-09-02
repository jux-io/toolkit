import sha256 from 'crypto-js/sha256';

export function calculateHash(str: string) {
  return sha256(str).toString();
}
