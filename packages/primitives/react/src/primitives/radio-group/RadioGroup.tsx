import React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useControlledState } from '../../hooks/useControlledState';
import PropTypes from 'prop-types';
import { createCustomContext } from '../../utils/createCustomContext';

/****************
 * TYPES
 ****************/

const RADIO_GROUP_NAME = 'Jux.RadioGroup.Root';

type PrimitiveDivProps = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.div
>;

/**
 * The layout direction of the radio group.
 * - 'horizontal': Radio items are laid out in a row
 * - 'vertical': Radio items are laid out in a column
 */
type Direction = 'horizontal' | 'vertical';

/**
 * The context value shared between RadioGroup and its children
 */
interface RadioGroupContextValue {
  /**
   * The name that binds all radio fields in the group.
   * Used to ensure proper form submission and accessibility.
   */
  name?: string;
  /**
   * The currently selected value in the group.
   * Used to determine which radio item is checked.
   */
  value?: string;
  /**
   * Whether the entire radio group is disabled.
   * When true, no items can be selected.
   */
  disabled?: boolean;
  /**
   * The layout direction of the radio group.
   * Affects both visual layout and keyboard navigation.
   */
  direction?: Direction;
  /**
   * Callback when a radio item is selected.
   * Receives the selected value as an argument.
   */
  onValueChange?: (value: string) => void;
  /**
   * Whether keyboard navigation should loop around when reaching the end.
   * When false, navigation stops at the first/last item.
   */
  loop?: boolean;
}

/****************
 * CONTEXT
 ****************/

const defaultContext: RadioGroupContextValue = {
  name: undefined,
  value: undefined,
  disabled: false,
  direction: undefined,
  onValueChange: undefined,
  loop: true,
};

const { Provider: RadioGroupProvider, useContext: useRadioGroupContext } =
  createCustomContext<RadioGroupContextValue>(RADIO_GROUP_NAME, defaultContext);

/****************
 * COMPONENTS
 ****************/

interface RadioGroupProps extends Omit<PrimitiveDivProps, 'defaultValue'> {
  /**
   * The name that binds all radio fields in the group.
   * Used to ensure proper form submission and accessibility.
   * If not provided, a unique name will be generated.
   */
  name?: string;
  /**
   * The layout direction of the radio group.
   * - 'horizontal': Radio items are laid out in a row
   * - 'vertical': Radio items are laid out in a column (default)
   */
  direction?: Direction;
  /**
   * The default selected value (uncontrolled mode).
   * Use this when you don't need to control the selection state.
   */
  defaultValue?: string;
  /**
   * The currently selected value (controlled mode).
   * Use this along with onValueChange for controlled selection state.
   */
  value?: string;
  /**
   * Callback when selection changes.
   * Receives the newly selected value as an argument.
   */
  onValueChange?: (value: string) => void;
  /**
   * Whether the entire radio group is disabled.
   * When true, no items can be selected.
   */
  disabled?: boolean;
  /**
   * Whether keyboard navigation should loop around when reaching the end.
   * When false, navigation stops at the first/last item.
   * @default true
   */
  loop?: boolean;
}

type RadioGroupElement = React.ElementRef<'div'>;

/**
 * RadioGroup Component
 *
 * A form control for selecting a single option from a list of radio buttons.
 * Implements the WAI-ARIA radio group pattern for accessibility.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Horizontal or vertical layout
 * - Keyboard navigation with optional loop behavior
 * - RTL support
 * - Form integration
 * - Full accessibility support
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <RadioGroup defaultValue="option1">
 *   <RadioGroupItem value="option1">Option 1</RadioGroupItem>
 *   <RadioGroupItem value="option2">Option 2</RadioGroupItem>
 * </RadioGroup>
 *
 * // Controlled
 * <RadioGroup
 *   value={selected}
 *   onValueChange={setSelected}
 *   direction="horizontal"
 * >
 *   <RadioGroupItem value="option1">Option 1</RadioGroupItem>
 *   <RadioGroupItem value="option2">Option 2</RadioGroupItem>
 * </RadioGroup>
 * ```
 */
const RadioGroup = React.forwardRef<RadioGroupElement, RadioGroupProps>(
  (props, forwardedRef) => {
    const {
      name,
      direction = 'vertical',
      defaultValue,
      value,
      disabled,
      onValueChange,
      children,
      loop = true,
      style,
      ...rootProps
    } = props;

    const [selectedValue, setSelectedValue] = useControlledState({
      prop: value,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    const contextValue = React.useMemo(
      () => ({
        name,
        value: selectedValue,
        disabled,
        direction,
        onValueChange: setSelectedValue,
        loop,
      }),
      [name, selectedValue, disabled, direction, setSelectedValue, loop]
    );

    return (
      <RadioGroupProvider {...contextValue}>
        <BasePrimitive.div
          role="radiogroup"
          aria-orientation={direction}
          data-disabled={disabled ? '' : undefined}
          data-direction={direction}
          {...rootProps}
          style={{
            display: 'flex',
            flexDirection: direction === 'horizontal' ? 'row' : 'column',
            gap: '0.5rem',
            ...style,
          }}
          ref={forwardedRef}
        >
          {children}
        </BasePrimitive.div>
      </RadioGroupProvider>
    );
  }
);

RadioGroup.displayName = RADIO_GROUP_NAME;

RadioGroup.propTypes = {
  /**
   * The name that binds all radio fields in the group
   */
  name: PropTypes.string,

  /**
   * The layout direction of the radio group
   */
  direction: PropTypes.oneOf(['horizontal', 'vertical'] as const),

  /**
   * The default selected value (uncontrolled mode)
   */
  defaultValue: PropTypes.string,

  /**
   * The currently selected value (controlled mode)
   */
  value: PropTypes.string,

  /**
   * Whether the radio group is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Whether to loop through options when navigating with arrow keys
   */
  loop: PropTypes.bool,

  /**
   * Callback when selection changes
   */
  onValueChange: PropTypes.func,
};

export { RadioGroup as Root, useRadioGroupContext };
export type {
  RadioGroupProps,
  RadioGroupElement,
  Direction,
  RadioGroupContextValue,
};
