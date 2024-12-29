/**
 * Select.Option
 */
import * as React from 'react';
import { useId } from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useListItem } from '@floating-ui/react';
import { useMergeRefs } from '../../hooks/useMergeRefs';
import { globalEventHandler } from '../../utils/globalEventHandler';
import { Keys } from '../../utils/keyboard';
import { SelectOptionProvider, useSelectContext } from './selectContext';
import { SelectState } from './types';

export const OPTION_NAME = 'Jux.Select.Option';

export interface SelectOptionProps<T = unknown>
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.div> {
  children: React.ReactNode;
  disabled?: boolean;
  label?: string;
  value: T;
  selected?: boolean;
}

export interface SelectOptionContextValue {
  disabled: boolean;
  isSelected: boolean;
  index: number;
}

function OptionImpl<T>(
  props: SelectOptionProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
  const id = `jux-select-option-${useId()}`;
  const {
    label,
    value,
    disabled = false,
    children,
    selected,
    ...otherProps
  } = props;
  const selectContext = useSelectContext(OPTION_NAME);

  const { ref, index } = useListItem({ label });
  const optionRef = React.useRef<HTMLDivElement>(null);

  const composedRefs = useMergeRefs(ref, forwardedRef, optionRef);

  const isActive = selectContext.activeIndex === index;
  const isSelected =
    selected ||
    (selectContext.multiple
      ? (selectContext.value as unknown[]).some(
          (v) => JSON.stringify(v) === JSON.stringify(value)
        )
      : JSON.stringify(selectContext.value) === JSON.stringify(value));

  // Handle selection state changes
  React.useLayoutEffect(() => {
    // Store the cloned element as soon as the option is mounted
    selectContext.popperContext.valuesRef.current[index] = value;
    if (optionRef.current) {
      try {
        // take the first child of the option element and clone it
        const clonedNode = optionRef.current.cloneNode(true);
        if (!(clonedNode instanceof HTMLElement)) {
          // eslint-disable-next-line no-console
          console.warn(
            'Failed to clone option element: cloned node is not an HTMLElement'
          );
          return;
        }

        // in case OptionIndicator is used, remove the element with aria-hidden attribute from the cloned element
        const optionIndicator = clonedNode.querySelector(
          '[aria-hidden="true"]'
        );

        if (optionIndicator) {
          optionIndicator.remove();
        }

        selectContext.selectedValueOptionElementsMap.current.set(
          JSON.stringify(value),
          clonedNode
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Error while cloning option element:', error);
      }
    }
    if (!selectContext.multiple) {
      // In single selection mode, clear all except the selected one
      const selectedKey = JSON.stringify(value);
      if (selected || isSelected) {
        // Keep only the selected value
        const selectedElement =
          selectContext.selectedValueOptionElementsMap.current.get(selectedKey);
        selectContext.selectedValueOptionElementsMap.current.clear();
        if (selectedElement) {
          selectContext.selectedValueOptionElementsMap.current.set(
            selectedKey,
            selectedElement
          );
        }
      }
    } else if (!isSelected || !selected) {
      // In multiple selection mode, only remove if not selected
      selectContext.selectedValueOptionElementsMap.current.delete(
        JSON.stringify(value)
      );
    }
  }, [isSelected, value, selectContext.multiple, index, selected]);

  return (
    <SelectOptionProvider
      isSelected={selected || isSelected}
      index={index}
      disabled={disabled}
    >
      <BasePrimitive.div
        ref={composedRefs}
        id={id}
        role={'option'}
        tabIndex={isActive ? 0 : -1}
        aria-labelledby={id}
        aria-selected={isSelected && isActive}
        aria-disabled={disabled || undefined}
        data-state={isSelected ? SelectState.Selected : SelectState.Idle}
        data-disabled={disabled ? '' : undefined}
        {...selectContext.popperContext.interactions.getItemProps({
          ...otherProps,
          onClick: globalEventHandler(otherProps.onClick, () => {
            selectContext.handleSelect(index);
          }),
          onKeyDown: globalEventHandler(otherProps.onKeyDown, (e) => {
            if (e.key === Keys.Enter) {
              e.preventDefault();
              selectContext.handleSelect(index);
            }
            if (e.key === Keys.Space && !selectContext.popperContext.isTyping) {
              e.preventDefault();
              selectContext.handleSelect(index);
            }
          }),
        })}
      >
        {children}
      </BasePrimitive.div>
    </SelectOptionProvider>
  );
}

export const Option = React.forwardRef(OptionImpl) as typeof OptionImpl & {
  displayName: string;
};

Option.displayName = OPTION_NAME;
