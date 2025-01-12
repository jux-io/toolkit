import * as React from 'react';
import {
  AccordionImplMultiple,
  AccordionMultipleProps,
} from './AccordionImplMultiple';
import {
  AccordionImplSingle,
  AccordionSingleProps,
} from './AccordionImplSingle';
import { ACCORDION_NAME } from './accordionContext';

const Root = React.forwardRef<
  HTMLDivElement,
  AccordionSingleProps | AccordionMultipleProps
>((props, forwardedRef) => {
  const { type, ...accordionProps } = props;
  const singleProps = accordionProps as AccordionSingleProps;
  const multipleProps = accordionProps as AccordionMultipleProps;

  return type === 'multiple' ? (
    <AccordionImplMultiple {...multipleProps} ref={forwardedRef} />
  ) : (
    <AccordionImplSingle {...singleProps} ref={forwardedRef} />
  );
});

Root.displayName = ACCORDION_NAME;

export { Root };
