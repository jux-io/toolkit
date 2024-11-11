/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GenericSlot } from '../generic-slot/GenericSlot';

const BasePrimitives = [
  'button',
  'span',
  'div',
  'p',
  'input',
  'label',
] as const;

type IBasePrimitives = {
  [E in (typeof BasePrimitives)[number]]: BasePrimitiveForwardRefComponent<E>;
};

type PrimitivePropsWithRef<ElementType extends React.ElementType> =
  React.ComponentPropsWithRef<ElementType> & {
    asChild?: boolean;
  };

type BasePrimitiveForwardRefComponent<ElementType extends React.ElementType> =
  React.ForwardRefExoticComponent<PrimitivePropsWithRef<ElementType>>;

const BasePrimitive = BasePrimitives.reduce((primitives, primitive) => {
  const Primitive = React.forwardRef(
    (props: PrimitivePropsWithRef<typeof primitive>, forwardedRef) => {
      const { asChild, ...rest } = props;
      const Comp: any = asChild ? GenericSlot : primitive;

      return <Comp {...rest} ref={forwardedRef} />;
    }
  );

  Primitive.displayName = `Primitive.${primitive}`;

  return { ...primitives, [primitive]: Primitive };
}, {} as IBasePrimitives);

export { BasePrimitive };
