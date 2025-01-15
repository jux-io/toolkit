import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useAccordionContext } from './accordionContext';
import { useAccordionItemContext } from './Item';
import { globalEventHandler } from '../../utils/globalEventHandler';

const TRIGGER_NAME = 'Jux.Accordion.Trigger';

export const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BasePrimitive.button>
>((props, forwardedRef) => {
  const { disabled: buttonDisabled, ...triggerProps } = props;
  const accordionContext = useAccordionContext(TRIGGER_NAME);
  const itemContext = useAccordionItemContext(TRIGGER_NAME);

  const disabled = buttonDisabled ?? itemContext.disabled;
  return (
    <BasePrimitive.button
      type="button"
      aria-expanded={itemContext.open}
      aria-controls={itemContext.contentId}
      aria-disabled={disabled}
      disabled={disabled}
      data-state={itemContext.open ? 'open' : 'closed'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={accordionContext.orientation}
      id={itemContext.triggerId}
      ref={forwardedRef}
      {...triggerProps}
      onClick={globalEventHandler(props.onClick, () => {
        accordionContext.onValueChange?.(itemContext?.value);
      })}
    />
  );
});

Trigger.displayName = TRIGGER_NAME;
