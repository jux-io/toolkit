import { type BasePrimitive } from '../base/BasePrimitives';

type Orientation = React.AriaAttributes['aria-orientation'];
type Direction = 'ltr' | 'rtl';

export interface AccordionBaseProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.div> {
  orientation?: Orientation;
  direction?: Direction;
  disabled?: boolean;
}

export enum AccordionState {
  Open = 'open',
  Closed = 'closed',
}
