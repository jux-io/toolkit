import * as React from 'react';

type PossibleRef<T> =
  | React.MutableRefObject<T>
  | React.LegacyRef<T>
  | undefined
  | null;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function mergeRefs<T>(refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

function useMergeRefs<T>(...refs: PossibleRef<T>[]) {
  return React.useCallback(mergeRefs(refs), refs);
}

export { mergeRefs, useMergeRefs };
