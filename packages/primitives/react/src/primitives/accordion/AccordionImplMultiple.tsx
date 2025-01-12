import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useControlledState } from '../../hooks/useControlledState';
import { AccordionBaseProps } from './types';
import { AccordionProvider } from './accordionContext';

export interface AccordionImplMultipleProps extends AccordionBaseProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string | string[]) => void;
}

export interface AccordionMultipleProps extends AccordionImplMultipleProps {
  type: 'multiple';
}

export const AccordionImplMultiple = React.forwardRef<
  HTMLDivElement,
  AccordionImplMultipleProps
>((props, forwardedRef) => {
  const {
    value: controlledValue,
    defaultValue,
    onValueChange,
    orientation = 'vertical',
    direction,
    disabled,
    ...accordionProps
  } = props;

  const [value = [], setValue] = useControlledState({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const handleItemOpen = React.useCallback(
    (itemValue: string) =>
      setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );

  const handleItemClose = React.useCallback(
    (itemValue: string) =>
      setValue((prevValue = []) =>
        prevValue.filter((value) => value !== itemValue)
      ),
    [setValue]
  );

  return (
    <AccordionProvider
      type="multiple"
      value={value}
      onValueChange={onValueChange}
      onItemOpen={handleItemOpen}
      onItemClose={handleItemClose}
      orientation={orientation}
      direction={direction}
      disabled={disabled}
    >
      <BasePrimitive.div
        ref={forwardedRef}
        data-orientation={orientation}
        data-disabled={disabled ? '' : undefined}
        {...accordionProps}
      />
    </AccordionProvider>
  );
});
