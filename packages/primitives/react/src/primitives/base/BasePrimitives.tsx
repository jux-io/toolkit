/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

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

type BasePrimitiveForwardRefComponent<E extends React.ElementType> =
  React.ForwardRefExoticComponent<React.ComponentPropsWithRef<E>>;

const BasePrimitive = BasePrimitives.reduce((primitives, primitive) => {
  const Primitive = React.forwardRef(
    (props: React.ComponentPropsWithRef<typeof primitive>, forwardedRef) => {
      const Comp: any = primitive;

      return <Comp {...props} ref={forwardedRef} />;
    }
  );

  Primitive.displayName = `Primitive.${primitive}`;

  return { ...primitives, [primitive]: Primitive };
}, {} as IBasePrimitives);

export { BasePrimitive };
