import * as React from 'react';

interface UseControlledStateParams<T> {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
}

type SetStateFn<T> = (prevState?: T) => T;

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControlledStateParams<T>, 'prop'>) {
  const uncontrolledState = React.useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChange?.(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, onChange]);

  return uncontrolledState;
}

function useControlledState<T>({
  prop,
  defaultProp,
  onChange = () => {
    /* noop */
  },
}: UseControlledStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
    React.useCallback(
      (nextValue) => {
        if (isControlled) {
          const setter = nextValue as SetStateFn<T>;
          const val =
            typeof nextValue === 'function' ? setter(prop) : nextValue;
          if (val !== prop) onChange?.(val as T);
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, onChange, setUncontrolledProp]
    );

  return [value, setValue] as const;
}

export { useControlledState };
