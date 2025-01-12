import * as React from 'react';
import { useId } from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useControlledState } from '../../hooks/useControlledState';
import { Direction, Orientation } from './types';
import { TABS_NAME, TabsProvider } from './tabsContext';

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.div> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: Orientation;
  direction?: Direction;
  activationMode?: 'automatic' | 'manual';
}

export const Root = React.forwardRef<HTMLDivElement, TabsProps>(
  (props, forwardedRef) => {
    const {
      value: controlledValue,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      direction,
      activationMode = 'automatic',
      ...rootProps
    } = props;

    const [value = '', setValue] = useControlledState({
      prop: controlledValue,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    const baseId = `jux-tabs-${useId()}`;

    return (
      <TabsProvider
        baseId={baseId}
        value={value}
        onValueChange={setValue}
        orientation={orientation}
        direction={direction}
        activationMode={activationMode}
      >
        <BasePrimitive.div
          data-orientation={orientation}
          ref={forwardedRef}
          {...rootProps}
        />
      </TabsProvider>
    );
  }
);

Root.displayName = TABS_NAME;
