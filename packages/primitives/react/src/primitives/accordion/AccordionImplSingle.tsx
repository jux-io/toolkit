import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useControlledState } from '../../hooks/useControlledState';
import { AccordionBaseProps } from './types';
import { AccordionProvider } from './accordionContext';

export interface AccordionImplSingleProps extends AccordionBaseProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
}

export interface AccordionSingleProps extends AccordionImplSingleProps {
  type: 'single';
}

export const AccordionImplSingle = React.forwardRef<
  HTMLDivElement,
  AccordionImplSingleProps
>((props, forwardedRef) => {
  const {
    value: controlledValue,
    defaultValue,
    onValueChange,
    collapsible = false,
    orientation = 'vertical',
    direction,
    disabled,
    ...accordionProps
  } = props;

  const [value, setValue] = useControlledState({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const handleItemOpen = React.useCallback(
    (itemValue: string) => {
      setValue(itemValue);
      onValueChange?.(itemValue);
    },
    [setValue, onValueChange]
  );

  const handleItemClose = React.useCallback(() => {
    if (collapsible) {
      setValue('');
      //onValueChange?.('');
    }
  }, [collapsible, setValue, onValueChange]);

  return (
    <AccordionProvider
      type="single"
      value={value ? [value] : []}
      onValueChange={onValueChange}
      onItemOpen={handleItemOpen}
      onItemClose={handleItemClose}
      orientation={orientation}
      direction={direction}
      disabled={disabled}
      collapsible={collapsible}
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
