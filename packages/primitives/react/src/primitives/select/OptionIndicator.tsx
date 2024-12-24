/**
 * Select.OptionIndicator
 */
import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useSelectOptionContext } from './selectContext';

export const INDICATOR_NAME = 'Jux.Select.OptionIndicator';
type SelectIndicatorElement = React.ElementRef<typeof BasePrimitive.span>;

interface SelectIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.span> {
  children: React.ReactNode;
}

export const OptionIndicator = React.forwardRef<
  SelectIndicatorElement,
  SelectIndicatorProps
>((props, forwardedRef) => {
  const optionContext = useSelectOptionContext(INDICATOR_NAME);

  return optionContext.isSelected ? (
    <BasePrimitive.span aria-hidden {...props} ref={forwardedRef}>
      {props.children}
    </BasePrimitive.span>
  ) : null;
});

OptionIndicator.displayName = INDICATOR_NAME;
