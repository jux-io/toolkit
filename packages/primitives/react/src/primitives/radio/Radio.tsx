import React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useMergeRefs } from '../../hooks/useMergeRefs';
import { globalEventHandler } from '../../utils/globalEventHandler';
import { useControlledState } from '../../hooks/useControlledState';
import PropTypes from 'prop-types';
import { useResizeObserver } from 'usehooks-ts';
import { createCustomContext } from '../../utils/createCustomContext';
import { useRadioGroupContext } from '../radio-group/RadioGroup';

/****************
 * TYPES
 ****************/

const RADIO_NAME = 'Jux.Radio';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.button
>;

type RadioState = boolean | 'indeterminate';

/****************
 * UTILS
 ****************/

const isStateIndeterminate = (
  checked?: RadioState
): checked is 'indeterminate' => checked === 'indeterminate';

const getCheckedState = (checked: RadioState) =>
  isStateIndeterminate(checked)
    ? 'indeterminate'
    : checked
      ? 'checked'
      : 'unchecked';

/****************
 * CONTEXT
 ****************/

interface RadioContextValue {
  state: RadioState;
  disabled?: boolean;
}

const defaultContext: RadioContextValue = {
  state: false,
  disabled: false,
};

const { Provider: RadioProvider } = createCustomContext<RadioContextValue>(
  RADIO_NAME,
  defaultContext
);

/****************
 * COMPONENTS
 ****************/

interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'checked'> {
  checked: RadioState;
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
 * Radio component
 */
interface RadioProps
  extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked' | 'value'> {
  /**
   * The value of the radio button, used when it belongs to a radio group
   */
  value: string;
  /**
   * The checked state of the radio button
   */
  checked?: RadioState;
  /**
   * The default checked state
   */
  defaultChecked?: RadioState;
  /**
   * Whether the radio is required in a form context
   */
  required?: boolean;
  /**
   * Callback when the checked state changes
   */
  onCheckedChange?(checked: RadioState): void;
  /**
   * Whether the radio is disabled
   */
  disabled?: boolean;
}

type RadioRootElement = React.ElementRef<'button'>;

const Radio = React.forwardRef<RadioRootElement, RadioProps>(
  (props, forwardedRef) => {
    const {
      checked: checkedProp,
      name: nameProp,
      required,
      defaultChecked,
      disabled: disabledProp,
      value,
      onCheckedChange,
      ...radioProps
    } = props;

    // Get radio group context if within a group
    const groupContext = useRadioGroupContext(RADIO_NAME);
    const isInGroup = groupContext !== null && groupContext.name !== undefined;

    // If in group, use group's name and disabled state
    const name = isInGroup ? groupContext?.name : nameProp;
    const disabled = isInGroup
      ? groupContext?.disabled || disabledProp
      : disabledProp;

    // If in group, checked state is controlled by the group's selected value
    const checked = isInGroup ? groupContext?.value === value : checkedProp;

    const [checkedState = false, setChecked] = useControlledState({
      prop: checked,
      defaultProp: defaultChecked,
      onChange: (newState) => {
        if (isInGroup && groupContext?.onValueChange && value) {
          groupContext.onValueChange(value);
        } else {
          onCheckedChange?.(newState);
        }
      },
    });

    const [buttonElement, setButton] = React.useState<HTMLButtonElement | null>(
      null
    );

    const composedRefs = useMergeRefs(forwardedRef, (node) => setButton(node));

    const contextValue = React.useMemo(
      () => ({
        state: checkedState,
        disabled,
      }),
      [checkedState, disabled]
    );

    return (
      <RadioProvider {...contextValue}>
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
   * The value of the radio button
   * @type {string}
   */
  value: PropTypes.string.isRequired,

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
   * Callback function that is called when the checked state changes.
   * @type {function}
   * @param {boolean | 'indeterminate'} checked - The new checked state
   */
  onCheckedChange: PropTypes.func,
};

export { Radio };
export type { RadioProps, RadioRootElement, RadioState };
