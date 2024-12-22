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

const TOGGLE_NAME = 'Jux.Toggle';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.button
>;

type ToggleState = boolean | 'indeterminate';

/****************
 * UTILS
 ****************/

function isStateIndeterminate(
  checked?: ToggleState
): checked is 'indeterminate' {
  return checked === 'indeterminate';
}

function getToggleState(checked: ToggleState) {
  return isStateIndeterminate(checked)
    ? 'indeterminate'
    : checked
      ? 'checked'
      : 'unchecked';
}

/****************
 * CONTEXT
 ****************/

interface ToggleContextValue {
  state: ToggleState;
  disabled?: boolean;
}

const { Provider: ToggleProvider } =
  createCustomContext<ToggleContextValue>(TOGGLE_NAME);

/****************
 * COMPONENTS
 ****************/

interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'checked'> {
  checked: ToggleState;
  toggleButton: HTMLButtonElement | null;
}

/**
 * InternalInput component that is hidden from the user.
 * It synchronizes with the visible toggle component to ensure proper form submission.
 */
const InternalInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, forwardedRef) => {
    const { toggleButton, checked, ...inputProps } = props;

    const toggleControlSize = useResizeObserver({
      ref: {
        current: toggleButton,
      },
      box: 'border-box',
    });

    return (
      <input
        type="checkbox"
        aria-hidden
        defaultChecked={isStateIndeterminate(checked) ? false : checked}
        tabIndex={-1}
        ref={forwardedRef}
        {...inputProps}
        style={{
          ...props.style,
          width: toggleControlSize.width,
          height: toggleControlSize.height,
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

InternalInput.displayName = 'InternalInput';

/**
 * Toggle
 */

interface ToggleProps
  extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
  checked?: ToggleState;
  defaultChecked?: ToggleState;
  required?: boolean;
  onCheckedChange?(checked: ToggleState): void;
}

type ToggleRootElement = React.ElementRef<'button'>;

const Toggle = React.forwardRef<ToggleRootElement, ToggleProps>(
  (props, forwardedRef) => {
    const {
      checked,
      name,
      required,
      defaultChecked,
      disabled,
      value = 'on',
      onCheckedChange,
      ...toggleProps
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
      <ToggleProvider state={checkedState} disabled={disabled}>
        <BasePrimitive.button
          type="button"
          role="switch"
          aria-checked={
            isStateIndeterminate(checkedState) ? 'mixed' : checkedState
          }
          aria-required={required}
          data-state={getToggleState(checkedState)}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          value={value}
          {...toggleProps}
          ref={composedRefs}
          onKeyDown={globalEventHandler(props.onKeyDown, (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          })}
          onClick={globalEventHandler(props.onClick, () => {
            setChecked((prevCheckedState) =>
              isStateIndeterminate(prevCheckedState) ? true : !prevCheckedState
            );
          })}
        />
        <InternalInput
          checked={checkedState}
          toggleButton={buttonElement}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
        />
      </ToggleProvider>
    );
  }
);

Toggle.displayName = TOGGLE_NAME;

/**
 * PropTypes for the Toggle component.
 * @type {Object}
 */
Toggle.propTypes = {
  /**
   * The initial state of the toggle. Can be a boolean or 'indeterminate'.
   * @type {boolean|'indeterminate'}
   */
  defaultChecked: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['indeterminate'] as const),
  ]),

  /**
   * The current state of the toggle. Can be a boolean or 'indeterminate'.
   * Use this for controlled components.
   * @type {boolean|'indeterminate'}
   */
  checked: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['indeterminate'] as const),
  ]),

  /**
   * If true, the toggle will be disabled and cannot be interacted with.
   * @type {boolean}
   */
  disabled: PropTypes.bool,

  /**
   * If true, the toggle will be marked as required in a form.
   * @type {boolean}
   */
  required: PropTypes.bool,

  /**
   * The name attribute of the toggle input element.
   * @type {string}
   */
  name: PropTypes.string,

  /**
   * The value attribute of the toggle input element.
   * @type {string}
   */
  value: PropTypes.string,

  /**
   * Callback function that is called when the toggle state changes.
   * @type {function}
   * @param {boolean | 'indeterminate'} checked - The new toggle state
   */
  onCheckedChange: PropTypes.func,
};

export { Toggle };
export type { ToggleProps, ToggleRootElement, ToggleState };
