import crypto from 'node:crypto';

export function calculateHash(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex');
}
