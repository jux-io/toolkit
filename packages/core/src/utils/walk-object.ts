/* eslint-disable @typescript-eslint/no-explicit-any */

export interface REPLACE_VALUE {
  type: 'replace';
  value: any;
  key?: string;
}

export interface REMOVE_VALUE {
  type: 'remove';
}

export interface MERGE_WITH_PARENT {
  type: 'merge_with_parent';
  value: any;
}

export interface ADD_VALUES {
  type: 'add_values';
  value: any;
}

export type WalkCallback = (
  key: string,
  value: any
) => REPLACE_VALUE | REMOVE_VALUE | MERGE_WITH_PARENT | ADD_VALUES | void;

export function walkObject(obj: any, callback: WalkCallback): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const action = callback(key, walkObject(value, callback));

    if (!action) {
      result[key] = value;
      return;
    }

    switch (action.type) {
      case 'replace':
        result[action.key ?? key] = action.value;
        break;
      case 'remove':
        break;
      case 'merge_with_parent':
        Object.assign(result, action.value);
        break;
    }
  }

  return result;
}
