import * as React from 'react';
import { useId } from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { createCustomContext } from '../../utils/createCustomContext';
import { useAccordionContext } from './accordionContext';
import { AccordionState } from './types';

const ITEM_NAME = 'Jux.Accordion.Item';

interface AccordionItemContextValue {
  triggerId: string;
  contentId: string;
  open: boolean;
  value: string;
  disabled?: boolean;
}

const { Provider: AccordionItemProvider, useContext: useAccordionItemContext } =
  createCustomContext<AccordionItemContextValue>(ITEM_NAME);

interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.div> {
  value: string;
  disabled?: boolean;
  open?: boolean;
}

export const Item = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  (props, forwardedRef) => {
    const { value, disabled, open, ...itemProps } = props;
    const accordionContext = useAccordionContext(ITEM_NAME);
    const itemId = useId();

    const triggerId = `jux-accordion-trigger-${itemId}`;
    const contentId = `jux-accordion-content-${itemId}`;

    const isOpen =
      (open ?? Array.isArray(accordionContext.value))
        ? accordionContext.value.includes(value)
        : accordionContext.value === value;

    return (
      <AccordionItemProvider
        triggerId={triggerId}
        contentId={contentId}
        open={isOpen}
        disabled={disabled}
        value={value}
      >
        <BasePrimitive.div
          data-state={isOpen ? AccordionState.Open : AccordionState.Closed}
          data-disabled={disabled ? '' : undefined}
          ref={forwardedRef}
          {...itemProps}
        />
      </AccordionItemProvider>
    );
  }
);

Item.displayName = ITEM_NAME;

export { useAccordionItemContext };
