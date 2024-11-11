import * as React from 'react';
import { useControlledState } from '../../hooks/useControlledState';
import { createCustomContext } from '../../utils/createCustomContext';
import { useId, useLayoutEffect, useMemo } from 'react';
import * as ReactDOM from 'react-dom';
import { BasePrimitive } from '../base/BasePrimitives';
import { useMergeRefs } from '../../hooks/useMergeRefs';
import { globalEventHandler } from '../../utils/globalEventHandler';
import { Keys } from '../../utils/keyboard';
import { RemoveScroll } from 'react-remove-scroll';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  offset,
  Placement,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useTypeahead,
} from '@floating-ui/react';

/****************
 * TYPES
 ****************/

const SELECT_NAME = 'Jux.Select';

enum OpenState {
  Open = 'open',
  Closed = 'closed',
}

enum SelectState {
  Selected = 'selected',
  Idle = 'idle',
}

type Direction = 'ltr' | 'rtl';

/****************
 * UTILS
 ****************/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValueEmpty(value?: any | any[]) {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'string') {
    return value === '';
  }

  return value === undefined || value === null;
}

/****************
 * CONTEXT
 ****************/

type SelectValue = string | string[];

interface SelectContextValue {
  contentId: string;
  // value can be any type, set by the user
  value: SelectValue;
  open: boolean;
  setOpen: (open: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  direction?: Direction;
  multiple?: boolean;

  handleSelect: (index: number) => void;

  activeIndex: number | null;
  selectedIndex: number | null;

  popperContext: {
    isTyping: boolean;
    interactions: ReturnType<typeof useInteractions>;
    floatingContext: ReturnType<typeof useFloating>;
    elementsRef: React.MutableRefObject<(HTMLElement | null)[]>;
    labelsRef: React.MutableRefObject<string[]>;
  };
}

const { Provider: SelectProvider, useContext: useSelectContext } =
  createCustomContext<SelectContextValue>(SELECT_NAME);

/****************
 * COMPONENTS
 ****************/

/**
 * Select.Root
 */

export interface SelectProps<ValueType> {
  children: React.ReactNode;
  value?: ValueType;
  defaultValue?: ValueType;
  onChange?: (value: ValueType) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  placement: Placement;
  alignOffset?: number;
  sideOffset?: number;
  closeOnSelect?: boolean;
}

function Root<ValueType>(props: SelectProps<ValueType>) {
  const {
    children,
    value: controlledValue,
    defaultValue,
    open: isOpen,
    onOpenChange,
    onChange,
    multiple,
    required = false,
    disabled = false,
    placement = 'bottom-start',
    alignOffset = 0,
    sideOffset = 0,
    closeOnSelect = true,
    name,
  } = props;

  const [open = false, setOpen] = useControlledState({
    prop: isOpen,
    defaultProp: false,
    onChange: onOpenChange,
  });

  const [value = multiple ? [] : '', setValue] = useControlledState<ValueType>({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange,
  });

  const floatingContext = useFloating({
    strategy: 'fixed',
    open,
    placement: placement,
    whileElementsMounted: autoUpdate,
    onOpenChange: setOpen,
    middleware: [
      offset({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
      flip(),
      size({
        apply({ rects, elements }) {
          elements.floating.style.setProperty(
            '--jux-select-trigger-width',
            `${rects.reference.width}px`
          );
        },
      }),
      shift({
        mainAxis: true,
        crossAxis: false,
      }),
    ],
  });

  const elementsRef = React.useRef<(HTMLElement | null)[]>([]);
  const labelsRef = React.useRef<string[]>([]);

  const [isTyping, setIsTyping] = React.useState(false);

  const click = useClick(floatingContext.context);
  const dismiss = useDismiss(floatingContext.context);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleSelect = React.useCallback(
    (index: number) => {
      setSelectedIndex(index);

      if (multiple) {
        const valuesCopy = (value as string[]).slice();

        const indexInValues = valuesCopy.indexOf(
          labelsRef.current[index] as string
        );

        if (-1 === indexInValues) {
          valuesCopy.push(labelsRef.current[index] as string);
        } else {
          // Remove the value
          valuesCopy.splice(indexInValues, 1);
        }
        setValue(valuesCopy as ValueType);
      } else {
        setValue(labelsRef.current[index] as ValueType);
      }

      if (closeOnSelect) {
        floatingContext.context.onOpenChange(false);
      }
    },
    [value, floatingContext.context]
  );

  function handleTypeaheadMatch(index: number) {
    if (open) {
      setActiveIndex(index);
    } else {
      handleSelect(index);
    }
  }

  const listNav = useListNavigation(floatingContext.context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const typeahead = useTypeahead(floatingContext.context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
    onTypingChange: setIsTyping,
  });

  const interactions = useInteractions([click, dismiss, listNav, typeahead]);

  const isFormControl = floatingContext.refs.reference.current
    ? !!(floatingContext.refs.reference.current as HTMLElement).closest('form')
    : true;

  return (
    <SelectProvider
      contentId={`jux-select-${useId()}`}
      value={value as string | string[]}
      open={open}
      setOpen={setOpen}
      required={required}
      disabled={disabled}
      multiple={multiple}
      handleSelect={handleSelect}
      activeIndex={activeIndex}
      selectedIndex={selectedIndex}
      popperContext={{
        isTyping,
        interactions,
        floatingContext,
        elementsRef,
        labelsRef,
      }}
    >
      {/* Add a hidden select for form validation that's required if any selection is needed */}
      {isFormControl && (
        <InternalSelect
          value={value as string | string[]}
          name={name}
          multiple={multiple}
          required={required}
        />
      )}
      {children}
    </SelectProvider>
  );
}

Root.displayName = SELECT_NAME;

/**
 * Select.InternalSelect
 */

/**
 * InternalSelect component is a hidden select element used for form validation.
 * It synchronizes with the visible select component to ensure proper form submission.
 */
const InternalSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithRef<'select'>
>((props, forwardedRef) => {
  const { multiple, value, name, required, ...selectProps } = props;
  const selectContext = useSelectContext('InternalSelect');

  return (
    <select
      ref={forwardedRef}
      aria-hidden
      style={{
        position: 'absolute',
        border: 0,
        width:
          selectContext.popperContext.floatingContext.refs.reference.current?.getBoundingClientRect()
            .width,
        height:
          selectContext.popperContext.floatingContext.refs.reference.current?.getBoundingClientRect()
            .height,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        clipPath: 'inset(100%)',
      }}
      tabIndex={-1}
      name={name}
      multiple={multiple}
      value={value as string | string[]}
      onChange={() => {
        return;
      }}
      required={required}
      {...selectProps}
    >
      {selectContext.popperContext.labelsRef.current.length > 0 &&
        selectContext.popperContext.labelsRef.current.map((label, index) => {
          return <option value={label} key={index} />;
        })}
    </select>
  );
});

/**
 * Select.TriggerButton
 */

const TRIGGER_NAME = 'Jux.Select.Trigger';

export type TriggerButtonProps = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.button
>;

const Trigger = React.forwardRef<HTMLButtonElement, TriggerButtonProps>(
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
        {...selectContext.popperContext.interactions.getReferenceProps(
          otherProps
        )}
        ref={ref}
      >
        {children}
      </BasePrimitive.button>
    );
  }
);

Trigger.displayName = TRIGGER_NAME;

/**
 * Select.Options
 */

const OPTIONS_NAME = 'Jux.Select.Options';

export type SelectOptionsProps = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.div
>;

type SelectOptionsElement = React.ElementRef<typeof BasePrimitive.div>;

const Options = React.forwardRef<SelectOptionsElement, SelectOptionsProps>(
  (props, forwardedRef) => {
    const { open, popperContext } = useSelectContext(OPTIONS_NAME);

    const optionsRef = useMergeRefs(
      popperContext.floatingContext.refs.setFloating,
      forwardedRef
    );

    const [fragment, setFragment] = React.useState<DocumentFragment>();

    useLayoutEffect(() => {
      setFragment(new DocumentFragment());
    }, []);

    if (!open) {
      return fragment
        ? ReactDOM.createPortal(<div>{props.children}</div>, fragment)
        : null;
    }

    return (
      <RemoveScroll>
        <FloatingPortal>
          <FloatingFocusManager
            context={popperContext.floatingContext.context}
            modal={false}
          >
            <BasePrimitive.div
              ref={optionsRef}
              style={popperContext.floatingContext.floatingStyles}
              {...popperContext.interactions.getFloatingProps(props)}
            >
              <FloatingList
                elementsRef={popperContext.elementsRef}
                labelsRef={popperContext.labelsRef}
              >
                {props.children}
              </FloatingList>
            </BasePrimitive.div>
          </FloatingFocusManager>
        </FloatingPortal>
      </RemoveScroll>
    );
  }
);

Options.displayName = OPTIONS_NAME;

/**
 * Select.Option
 */

const OPTION_NAME = 'Jux.Select.Option';

type SelectOptionElement = React.ElementRef<typeof BasePrimitive.div>;

interface SelectOptionProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.div> {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
}

interface SelectOptionContextValue {
  disabled: boolean;
  isSelected: boolean;
  index: number;
}

const { Provider: SelectOptionProvider, useContext: useSelectOptionContext } =
  createCustomContext<SelectOptionContextValue>(OPTION_NAME);

const Option = React.forwardRef<SelectOptionElement, SelectOptionProps>(
  (props, forwardedRef) => {
    const id = `jux-select-option-${useId()}`;
    const { label, disabled = false, ...otherProps } = props;
    const selectContext = useSelectContext(OPTION_NAME);

    const { ref, index } = useListItem({ label });

    const composedRefs = useMergeRefs(ref, forwardedRef);

    const isActive = selectContext.activeIndex === index;
    const isSelected = selectContext.multiple
      ? (selectContext.value as string[]).some((v) => v === label)
      : selectContext.value === label;

    return (
      <SelectOptionProvider
        isSelected={isSelected}
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
              if (
                e.key === Keys.Space &&
                !selectContext.popperContext.isTyping
              ) {
                e.preventDefault();
                selectContext.handleSelect(index);
              }
            }),
          })}
        />
      </SelectOptionProvider>
    );
  }
);

Option.displayName = OPTION_NAME;

/**
 * Select.Value
 */

const VALUE_NAME = 'Jux.Select.Value';

type SelectValueElement = React.ElementRef<typeof BasePrimitive.span>;

interface SelectValueProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.span> {
  placeholder?: React.ReactNode;
}

const Value = React.forwardRef<SelectValueElement, SelectValueProps>(
  (props, forwardedRef) => {
    const { placeholder, ...otherProps } = props;
    const selectContext = useSelectContext(VALUE_NAME);

    const value = useMemo(() => {
      if (isValueEmpty(selectContext.value)) {
        return placeholder;
      }

      if (selectContext.multiple) {
        return (selectContext.value as string[]).join(', ');
      }

      return selectContext.value;
    }, [selectContext.value, selectContext.multiple, placeholder]);

    return (
      <BasePrimitive.span ref={forwardedRef} {...otherProps}>
        {value}
      </BasePrimitive.span>
    );
  }
);

Value.displayName = VALUE_NAME;

/**
 * Select.OptionIndicator
 */

const INDICATOR_NAME = 'Jux.Select.OptionIndicator';

type SelectIndicatorElement = React.ElementRef<typeof BasePrimitive.span>;

interface SelectIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.span> {
  children: React.ReactNode;
}

const OptionIndicator = React.forwardRef<
  SelectIndicatorElement,
  SelectIndicatorProps
>((props, forwardedRef) => {
  const optionContext = useSelectOptionContext(INDICATOR_NAME);

  return optionContext.isSelected ? (
    <BasePrimitive.span aria-hidden {...props} ref={forwardedRef}>
      {props.children}
    </BasePrimitive.span>
  ) : null;
});

OptionIndicator.displayName = INDICATOR_NAME;

/**
 * Select.OptionsGroup
 */

const OPTIONS_GROUP_NAME = 'Jux.Select.OptionsGroup';

interface SelectOptionsGroupContextValue {
  groupId: string;
}

type SelectOptionsGroupElement = React.ElementRef<typeof BasePrimitive.div>;

const {
  Provider: SelectOptionsGroupProvider,
  useContext: useSelectOptionsGroupContext,
} = createCustomContext<SelectOptionsGroupContextValue>(OPTIONS_GROUP_NAME);

const OptionsGroup = React.forwardRef<
  SelectOptionsGroupElement,
  React.ComponentPropsWithRef<typeof BasePrimitive.div>
>((props, forwardedRef) => {
  const optionsGroupId = `jux-options-group-${useId()}`;

  return (
    <SelectOptionsGroupProvider groupId={optionsGroupId}>
      <BasePrimitive.div
        ref={forwardedRef}
        role={'group'}
        aria-labelledby={optionsGroupId}
        {...props}
      />
    </SelectOptionsGroupProvider>
  );
});

/**
 * Select.OptionsGroupLabel
 */

const OPTIONS_GROUP_LABEL_NAME = 'Jux.Select.OptionsGroupLabel';

type SelectOptionsGroupLabelElement = React.ElementRef<
  typeof BasePrimitive.div
>;

interface SelectOptionsGroupLabelProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.div> {
  children: React.ReactNode;
}

const OptionsGroupLabel = React.forwardRef<
  SelectOptionsGroupLabelElement,
  SelectOptionsGroupLabelProps
>((props, forwardedRef) => {
  const optionsGroupContext = useSelectOptionsGroupContext(
    OPTIONS_GROUP_LABEL_NAME
  );

  return (
    <BasePrimitive.div
      ref={forwardedRef}
      id={optionsGroupContext.groupId}
      {...props}
    />
  );
});

export {
  Root,
  Trigger,
  Options,
  Option,
  Value,
  OptionIndicator,
  OptionsGroup,
  OptionsGroupLabel,
};
