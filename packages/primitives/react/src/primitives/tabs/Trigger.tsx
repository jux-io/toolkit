import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useTabsContext } from './tabsContext';
import { TabsState } from './types';
import { globalEventHandler } from '../../utils/globalEventHandler';

const TRIGGER_NAME = 'Jux.Tabs.Trigger';

interface TriggerProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.button> {
  value: string;
  disabled?: boolean;
}

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  (props, forwardedRef) => {
    const { value, disabled, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME);
    const isSelected = context.value === value;

    return (
      <BasePrimitive.button
        type="button"
        role="tab"
        aria-selected={isSelected}
        aria-controls={`${context.baseId}-content-${value}`}
        data-state={isSelected ? TabsState.Active : TabsState.Inactive}
        data-orientation={context.orientation}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        tabIndex={isSelected ? 0 : -1}
        ref={forwardedRef}
        {...triggerProps}
        onClick={globalEventHandler(props.onClick, () => {
          if (context.activationMode === 'automatic') {
            context.onValueChange?.(value);
          }
        })}
      />
    );
  }
);

Trigger.displayName = TRIGGER_NAME;
