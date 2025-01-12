import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useAccordionContext } from './accordionContext';

const HEADER_NAME = 'Jux.Accordion.Header';

type AccordionHeaderElement = React.ElementRef<typeof BasePrimitive.h3>;
type PrimitiveHeading3Props = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.h3
>;
interface AccordionHeaderProps extends PrimitiveHeading3Props {}

export const Header = React.forwardRef<
  AccordionHeaderElement,
  AccordionHeaderProps
>((props, forwardedRef) => {
  const context = useAccordionContext(HEADER_NAME);

  return (
    <BasePrimitive.h3
      ref={forwardedRef}
      data-orientation={context.orientation}
      //data-state={context.state}
      {...props}
    />
  );
});

Header.displayName = HEADER_NAME;
