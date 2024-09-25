import React, { FC } from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useMergeRefs } from '../../hooks/useMergeRefs';
import { globalEventHandler } from '../../utils/globalEventHandler';
import { useControllableState } from '../../hooks/useControlledState';
import PropTypes from 'prop-types';
import { useResizeObserver } from 'usehooks-ts';
import { createCustomContext } from '../../utils/createCustomContext';

/****************
 * TYPES
 ****************/

const CHECKBOX_NAME = 'Jux.Checkbox';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;

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

interface CheckboxContextValue {
  state: CheckedState;
  disabled?: boolean;
}

const { Provider: CheckboxProvider } =
  createCustomContext<CheckboxContextValue>(CHECKBOX_NAME);

/****************
 * COMPONENTS
 ****************/

/**
 * InternalInput component that is hidden from the user
 */

interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'checked'> {
  checked: CheckedState;
  checkboxButton: HTMLButtonElement | null;
}

const InternalInput: FC<InputProps> = (props) => {
  const { checkboxButton, checked, ...inputProps } = props;
  const ref = React.useRef<HTMLInputElement>(null);

  const checkboxControlSize = useResizeObserver({
    ref: {
      current: checkboxButton,
    },
    box: 'border-box',
  });

  return (
    <input
      type={'checkbox'}
      aria-hidden
      defaultChecked={isStateIndeterminate(checked) ? false : checked}
      tabIndex={-1}
      ref={ref}
      {...inputProps}
      style={{
        ...props.style,
        width: checkboxControlSize.width,
        height: checkboxControlSize.height,
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
        margin: 0,
        transform: 'translateX(-100%)',
      }}
    />
  );
};

/**
 * Checkbox
 */

interface CheckboxProps
  extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  required?: boolean;
  onCheckedChange?(checked: CheckedState): void;
}

type CheckboxRootElement = React.ElementRef<'button'>;

const Checkbox = React.forwardRef<CheckboxRootElement, CheckboxProps>(
  (props, forwardedRef) => {
    const {
      checked,
      name,
      required,
      defaultChecked,
      disabled,
      value = 'on',
      onCheckedChange,
      ...checkboxProps
    } = props;

    const [checkedState = false, setChecked] = useControllableState({
      prop: checked,
      defaultProp: defaultChecked,
      onChange: onCheckedChange,
    });

    const [buttonElement, setButton] = React.useState<HTMLButtonElement | null>(
      null
    );

    const composedRefs = useMergeRefs(forwardedRef, (node) => setButton(node));

    return (
      <CheckboxProvider state={checkedState} disabled={disabled}>
        <BasePrimitive.button
          type={'button'}
          role={'checkbox'}
          aria-checked={
            isStateIndeterminate(checkedState) ? 'mixed' : checkedState
          } // Could be 'true', 'false', or 'mixed'
          aria-required={required}
          data-state={getCheckedState(checkedState)} // Could be 'unchecked' or 'indeterminate'
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          value={value}
          {...checkboxProps}
          ref={composedRefs}
          onKeyDown={globalEventHandler(props.onKeyDown, (e) => {
            // Handle keydown events
            // WAI ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

            // Checkboxes don't activate on enter keypress
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          })}
          onClick={globalEventHandler(props.onClick, () => {
            // Handle click events
            setChecked((prevCheckedState) =>
              isStateIndeterminate(prevCheckedState) ? true : !prevCheckedState
            );
          })}
        />
        <InternalInput
          checked={checkedState}
          checkboxButton={buttonElement}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
        />
      </CheckboxProvider>
    );
  }
);

Checkbox.displayName = CHECKBOX_NAME;

/**
 * PropTypes for the Checkbox component.
 * @type {Object}
 */
Checkbox.propTypes = {
  /**
   * The initial checked state of the checkbox. Can be a boolean or 'indeterminate'.
   * @type {boolean|'indeterminate'}
   */
  defaultChecked: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['indeterminate'] as const),
  ]),

  /**
   * The current checked state of the checkbox. Can be a boolean or 'indeterminate'.
   * Use this for controlled components.
   * @type {boolean|'indeterminate'}
   */
  checked: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['indeterminate'] as const),
  ]),

  /**
   * If true, the checkbox will be disabled and cannot be interacted with.
   * @type {boolean}
   */
  disabled: PropTypes.bool,

  /**
   * If true, the checkbox will be marked as required in a form.
   * @type {boolean}
   */
  required: PropTypes.bool,

  /**
   * The name attribute of the checkbox input element.
   * @type {string}
   */
  name: PropTypes.string,

  /**
   * The value attribute of the checkbox input element.
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

export { Checkbox };
export type { CheckboxProps, CheckboxRootElement, CheckedState };
