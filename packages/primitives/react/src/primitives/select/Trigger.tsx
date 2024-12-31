/**
 * Select.TriggerButton
 */
import * as React from 'react';
import { useMergeRefs } from '../../hooks/useMergeRefs';
import { BasePrimitive } from '../base/BasePrimitives';
import { OpenState } from './types';
import { useSelectContext } from './selectContext';
import { isValueEmpty } from './utils';

export const TRIGGER_NAME = 'Jux.Select.Trigger';
export type TriggerButtonProps = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.button
>;
export const Trigger = React.forwardRef<HTMLButtonElement, TriggerButtonProps>(
  (props, forwardedRef) => {
    const { disabled, asChild, children, ...otherProps } = props;
    const selectContext = useSelectContext('TriggerButton');

    const ref = useMergeRefs(
      forwardedRef,
      selectContext.popperContext.floatingContext.refs.setReference
    );

    const isDisabled = selectContext.disabled || disabled;

    return (
      <BasePrimitive.button
        asChild={asChild}
        type={'button'}
        aria-haspopup={'listbox'}
        aria-expanded={selectContext.open}
        aria-required={selectContext.required}
        aria-autocomplete={'none'}
        aria-controls={selectContext.contentId}
        role={'combobox'}
        data-state={selectContext.open ? OpenState.Open : OpenState.Closed}
        data-placeholder={isValueEmpty(selectContext.value) ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        disabled={isDisabled}
        dir={selectContext.direction}
        ref={ref}
        {...otherProps}
      >
        {children}
      </BasePrimitive.button>
    );
  }
);

Trigger.displayName = TRIGGER_NAME;
