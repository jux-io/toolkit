import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useAccordionContext } from './accordionContext';
import { useAccordionItemContext } from './Item';

const CONTENT_NAME = 'Jux.Accordion.Content';

interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.div> {
  open?: boolean;
}

export const Content = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  (props, forwardedRef) => {
    const { open, ...otherProps } = props;
    const accordionContext = useAccordionContext(CONTENT_NAME);
    const itemContext = useAccordionItemContext(CONTENT_NAME);

    return (open ?? itemContext.open) ? (
      <BasePrimitive.div
        data-state={itemContext.open ? 'open' : 'closed'}
        data-disabled={itemContext.disabled ? '' : undefined}
        data-orientation={accordionContext.orientation}
        id={itemContext.contentId}
        role="region"
        aria-labelledby={itemContext.triggerId}
        ref={forwardedRef}
        {...otherProps}
      />
    ) : null;
  }
);

Content.displayName = CONTENT_NAME;
