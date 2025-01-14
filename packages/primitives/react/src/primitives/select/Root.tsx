import * as React from 'react';
import { useId, useMemo } from 'react';
import { useControlledState } from '../../hooks/useControlledState';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  Placement,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useTypeahead,
} from '@floating-ui/react';
import { SelectValue } from './types';
import { SELECT_NAME, SelectProvider, useSelectContext } from './selectContext';
import { useMergeRefs } from '../../hooks/useMergeRefs';

export const TRIGGER_WIDTH_VAR = '--jux-select-trigger-width';

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
  className?: string;
  portalContainerId?: string;
}

export function RootImpl<ValueType>(
  props: SelectProps<ValueType>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
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
    portalContainerId,
    ...otherProps
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
    // We use a fixed position + transform strategy instead of absolute positioning:
    // 1. Better performance - transforms are GPU accelerated
    // 2. More reliable positioning - fixed positioning ensures consistent coordinates
    // 3. Handles all placements (top, bottom, etc) correctly by using translate3d
    // 4. Prevents layout shifts by setting initial position to 0,0 and moving with transform
    whileElementsMounted: (...args) => {
      const [reference, floating, update] = args;
      const cleanup = autoUpdate(reference, floating, () => {
        computePosition(reference, floating, {
          placement,
          middleware: [
            offset({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
            flip(),
            size({
              apply({ rects }) {
                Object.assign(floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ],
        }).then(({ x, y }) => {
          Object.assign(floating.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
          });
          update();
        });
      });
      return cleanup;
    },
    transform: true,
    onOpenChange: setOpen,
    middleware: [
      offset({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
      flip(),
      size({
        apply({ rects, elements }) {
          elements.floating.style.setProperty(
            TRIGGER_WIDTH_VAR,
            `${rects.reference.width}px`
          );
        },
      }),
    ],
  });

  const elementsRef = React.useRef<(HTMLElement | null)[]>([]);
  const labelsRef = React.useRef<string[]>([]);
  const valuesRef = React.useRef<unknown[]>([]);
  const selectedValueOptionElementsMap = React.useRef<Map<string, HTMLElement>>(
    new Map()
  );
  const optionListElementsMap = React.useRef<Map<string, HTMLElement>>(
    new Map()
  );
  const [isTyping, setIsTyping] = React.useState(false);

  const click = useClick(floatingContext.context);
  const dismiss = useDismiss(floatingContext.context);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleSelect = React.useCallback(
    (index: number) => {
      setSelectedIndex(index);

      if (multiple) {
        const valuesCopy = (value as unknown[]).slice();
        const newValue = valuesRef.current[index];

        const indexInValues = valuesCopy.findIndex(
          (v) => JSON.stringify(v) === JSON.stringify(newValue)
        );

        if (-1 === indexInValues) {
          valuesCopy.push(newValue);
        } else {
          // Remove the value
          valuesCopy.splice(indexInValues, 1);
        }
        setValue(valuesCopy as ValueType);
      } else {
        setValue(valuesRef.current[index] as ValueType);
      }

      if (closeOnSelect) {
        floatingContext.context.onOpenChange(false);
      }
    },
    [value, floatingContext.context, multiple, closeOnSelect, setValue]
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

  const ref = useMergeRefs(forwardedRef, floatingContext.refs.setReference);

  return (
    <SelectProvider
      contentId={`jux-select-${useId()}`}
      value={value as SelectValue<ValueType>}
      open={open}
      setOpen={setOpen}
      required={required}
      disabled={disabled}
      multiple={multiple}
      handleSelect={handleSelect}
      activeIndex={activeIndex}
      selectedIndex={selectedIndex}
      portalContainerId={portalContainerId}
      selectedValueOptionElementsMap={selectedValueOptionElementsMap}
      optionListElementsMap={optionListElementsMap}
      popperContext={{
        isTyping,
        interactions,
        floatingContext,
        elementsRef,
        labelsRef,
        valuesRef,
      }}
    >
      <div {...interactions.getReferenceProps({ ...otherProps })} ref={ref}>
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
      </div>
    </SelectProvider>
  );
}

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

  const stringifiedValues = useMemo(() => {
    if (multiple) {
      return (value as unknown[]).map((v) => JSON.stringify(v));
    }
    return JSON.stringify(value);
  }, [value, multiple]);

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
      value={stringifiedValues}
      onChange={() => {
        return;
      }}
      required={required}
      {...selectProps}
    >
      {selectContext.popperContext.valuesRef.current.map((value, index) => (
        <option key={index} value={JSON.stringify(value)}>
          {selectContext.popperContext.labelsRef.current[index]}
        </option>
      ))}
    </select>
  );
});

export const Root = React.forwardRef(RootImpl) as typeof RootImpl & {
  displayName: string;
};

Root.displayName = SELECT_NAME;
