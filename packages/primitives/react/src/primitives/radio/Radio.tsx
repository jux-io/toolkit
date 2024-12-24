import React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useMergeRefs } from '../../hooks/useMergeRefs';
import { globalEventHandler } from '../../utils/globalEventHandler';
import { useControlledState } from '../../hooks/useControlledState';
import PropTypes from 'prop-types';
import { useResizeObserver } from 'usehooks-ts';
import { createCustomContext } from '../../utils/createCustomContext';

/****************
 * TYPES
 ****************/

const RADIO_NAME = 'Jux.Radio';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.button
>;

type CheckedState = boolean | 'indeterminate';

/****************
 * UTILS
 ****************/

function isStateIndeterminate(
  checked?: CheckedState
): checked is 'indeterminate' {
  return checked === 'indeterminate';
}

function getCheckedState(checked: CheckedState) {
  return isStateIndeterminate(checked)
    ? 'indeterminate'
    : checked
      ? 'checked'
      : 'unchecked';
}

/****************
 * CONTEXT
 ****************/

interface RadioContextValue {
  state: CheckedState;
  disabled?: boolean;
}

const { Provider: RadioProvider } =
  createCustomContext<RadioContextValue>(RADIO_NAME);

/****************
 * COMPONENTS
 ****************/

interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'checked'> {
  checked: CheckedState;
  radioButton: HTMLButtonElement | null;
}

/**
 * InternalInput component that is hidden from the user.
 * It synchronizes with the visible radio component to ensure proper form submission.
 */
const InternalInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, forwardedRef) => {
    const { radioButton, checked, ...inputProps } = props;

    const radioControlSize = useResizeObserver({
      ref: {
        current: radioButton,
      },
      box: 'border-box',
    });

    return (
      <input
        type="radio"
        aria-hidden
        defaultChecked={isStateIndeterminate(checked) ? false : checked}
        tabIndex={-1}
        ref={forwardedRef}
        {...inputProps}
        style={{
          ...props.style,
          width: radioControlSize.width,
          height: radioControlSize.height,
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          margin: 0,
          transform: 'translateX(-100%)',
        }}
      />
    );
  }
);

/**
 * Radio
 */

interface RadioProps
  extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  required?: boolean;
  onCheckedChange?(checked: CheckedState): void;
  value?: string;
}

type RadioRootElement = React.ElementRef<'button'>;

const Radio = React.forwardRef<RadioRootElement, RadioProps>(
  (props, forwardedRef) => {
    const {
      checked,
      name,
      required,
      defaultChecked,
      disabled,
      value,
      onCheckedChange,
      ...radioProps
    } = props;

    const [checkedState = false, setChecked] = useControlledState({
      prop: checked,
      defaultProp: defaultChecked,
      onChange: onCheckedChange,
    });

    const [buttonElement, setButton] = React.useState<HTMLButtonElement | null>(
      null
    );

    const composedRefs = useMergeRefs(forwardedRef, (node) => setButton(node));

    return (
      <RadioProvider state={checkedState} disabled={disabled}>
        <BasePrimitive.button
          type="button"
          role="radio"
          aria-checked={
            isStateIndeterminate(checkedState) ? 'mixed' : checkedState
          }
          aria-required={required}
          data-state={getCheckedState(checkedState)}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          value={value}
          {...radioProps}
          ref={composedRefs}
          onKeyDown={globalEventHandler(props.onKeyDown, (e) => {
            // Handle keydown events
            // WAI ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

            // Radio button don't activate on enter keypress
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          })}
          onClick={globalEventHandler(props.onClick, () => {
            // Handle click events - Radio can only be checked, not unchecked
            if (!checkedState) {
              setChecked(true);
            }
          })}
        />
        <InternalInput
          checked={checkedState}
          radioButton={buttonElement}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
        />
      </RadioProvider>
    );
  }
);

Radio.displayName = RADIO_NAME;

/**
 * PropTypes for the Radio component.
 * @type {Object}
 */
Radio.propTypes = {
  /**
   * The initial checked state of the radio. Can be a boolean or 'indeterminate'.
   * @type {boolean|'indeterminate'}
   */
  defaultChecked: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['indeterminate'] as const),
  ]),

  /**
   * The current checked state of the radio. Can be a boolean or 'indeterminate'.
   * Use this for controlled components.
   * @type {boolean|'indeterminate'}
   */
  checked: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['indeterminate'] as const),
  ]),

  /**
   * If true, the radio will be disabled and cannot be interacted with.
   * @type {boolean}
   */
  disabled: PropTypes.bool,

  /**
   * If true, the radio will be marked as required in a form.
   * @type {boolean}
   */
  required: PropTypes.bool,

  /**
   * The name attribute of the radio input element.
   * @type {string}
   */
  name: PropTypes.string,

  /**
   * The value attribute of the radio input element.
   * @type {string}
   */
  value: PropTypes.string,

  /**
   * Callback function that is called when the checked state changes.
   * @type {function}
   * @param {boolean | 'indeterminate'} checked - The new checked state
   */
  onCheckedChange: PropTypes.func,
};

export { Radio };
export type { RadioProps, RadioRootElement, CheckedState };
