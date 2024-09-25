import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { globalEventHandler } from '../../utils/globalEventHandler';

/****************
 * TYPES
 ****************/
const LABEL_NAME = 'Jux.Label';

type PrimitiveLabelProps = React.ComponentPropsWithoutRef<'label'>;

type LabelElement = React.ElementRef<typeof BasePrimitive.label>;

/****************
 * COMPONENTS
 ****************/

const Label = React.forwardRef<LabelElement, PrimitiveLabelProps>(
  (props, forwardedRef) => {
    return (
      <BasePrimitive.label
        {...props}
        ref={forwardedRef}
        onMouseDown={globalEventHandler(props.onMouseDown, (e) => {
          const target = e.target as HTMLElement;

          if (target.closest('button, input, select, textarea')) return;

          props.onMouseDown?.(e);

          // for mousedown events, UIEvent.detail is 1 plus the number of clicks
          // if user double clicks, prevent text selection
          if (!e.defaultPrevented && e.detail > 1) e.preventDefault();
        })}
      />
    );
  }
);

Label.displayName = LABEL_NAME;

export { Label };

export type { PrimitiveLabelProps };
