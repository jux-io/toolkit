import React from 'react';
import { useRadioGroupContext } from './RadioGroup';
import { Radio, type RadioProps, type RadioRootElement } from '../radio/Radio';
import { globalEventHandler } from '../../utils/globalEventHandler';

/****************
 * TYPES
 ****************/

const RADIO_GROUP_ITEM_NAME = 'Jux.RadioGroup.Item';

/****************
 * UTILS
 ****************/

function getNextFocusableRadio(
  container: HTMLElement,
  currentElement: HTMLElement | null,
  direction: 'next' | 'prev',
  loop: boolean
): HTMLElement | null {
  const radios = Array.from(
    container.querySelectorAll('[role="radio"]:not([disabled])')
  ) as HTMLElement[];

  if (!radios.length) return null;

  const currentIndex = currentElement ? radios.indexOf(currentElement) : -1;
  let nextIndex: number;

  if (direction === 'next') {
    nextIndex = currentIndex + 1;
    if (nextIndex >= radios.length) {
      nextIndex = loop ? 0 : radios.length - 1;
    }
  } else {
    nextIndex = currentIndex - 1;
    if (nextIndex < 0) {
      nextIndex = loop ? radios.length - 1 : 0;
    }
  }

  return radios[nextIndex];
}

/****************
 * COMPONENTS
 ****************/

interface RadioGroupItemProps
  extends Omit<RadioProps, 'checked' | 'onCheckedChange' | 'name'> {
  /**
   * The value of the radio item. This value will be passed to the RadioGroup's onValueChange
   * when this item is selected.
   */
  value: string;
}

/**
 * RadioGroupItem component
 * A specialized Radio component that integrates with RadioGroup
 * and handles keyboard navigation according to WAI-ARIA radio group pattern.
 *
 * Features:
 * - Automatic keyboard navigation based on group direction
 * - RTL support for horizontal groups
 * - Focus management with optional loop behavior
 * - Proper ARIA attributes and roles
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * <RadioGroup>
 *   <div>
 *     <RadioGroupItem value="option1" id="radio1" />
 *     <label htmlFor="radio1">Option 1</label>
 *   </div>
 * </RadioGroup>
 * ```
 */
const RadioGroupItem = React.forwardRef<RadioRootElement, RadioGroupItemProps>(
  (props, forwardedRef) => {
    const { value, disabled, onKeyDown, ...radioProps } = props;

    const context = useRadioGroupContext(RADIO_GROUP_ITEM_NAME);
    const isChecked = context?.value === value;
    const isDisabled = disabled || context?.disabled;

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!context?.onValueChange || isDisabled) return;

        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (arrowKeys.includes(event.key)) {
          event.preventDefault();

          const isHorizontal = context.direction === 'horizontal';
          const isRTL = document.dir === 'rtl';

          let nextDirection: 'next' | 'prev';
          switch (event.key) {
            case 'ArrowLeft':
              nextDirection = isHorizontal && !isRTL ? 'prev' : 'next';
              break;
            case 'ArrowRight':
              nextDirection = isHorizontal && !isRTL ? 'next' : 'prev';
              break;
            case 'ArrowUp':
              nextDirection = !isHorizontal ? 'prev' : 'next';
              break;
            case 'ArrowDown':
              nextDirection = !isHorizontal ? 'next' : 'prev';
              break;
            default:
              return;
          }

          const currentFocused = document.activeElement;
          if (!(currentFocused instanceof HTMLElement)) return;

          const container = currentFocused.closest('[role="radiogroup"]');
          if (!(container instanceof HTMLElement)) return;

          const nextRadio = getNextFocusableRadio(
            container,
            currentFocused,
            nextDirection,
            context.loop ?? true
          );

          if (nextRadio) {
            nextRadio.focus();
            const value = nextRadio.getAttribute('value');
            if (value) {
              context.onValueChange(value);
            }
          }
        }

        // Space or Enter selects the current radio
        if ((event.key === ' ' || event.key === 'Enter') && !isChecked) {
          event.preventDefault();
          context.onValueChange(value);
        }
      },
      [
        context?.onValueChange,
        context?.direction,
        context?.loop,
        isDisabled,
        isChecked,
        value,
      ]
    );

    return (
      <Radio
        {...radioProps}
        ref={forwardedRef}
        value={value}
        disabled={isDisabled}
        name={context?.name}
        checked={isChecked}
        onKeyDown={globalEventHandler(onKeyDown, handleKeyDown)}
        onCheckedChange={() => context?.onValueChange?.(value)}
      />
    );
  }
);

RadioGroupItem.displayName = RADIO_GROUP_ITEM_NAME;

export { RadioGroupItem as Item };
export type { RadioGroupItemProps };
