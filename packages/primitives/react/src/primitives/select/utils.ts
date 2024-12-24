import { SelectValue } from './types';

export function isValueEmpty<T>(value?: SelectValue<T>) {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value === undefined || value === null || value === '') {
    return true;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}
