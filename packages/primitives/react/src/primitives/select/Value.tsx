/**
 * Select.Value
 */
import * as React from 'react';
import { useMemo } from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { SelectContextValue, useSelectContext } from './selectContext';
import { isValueEmpty } from './utils';

export const VALUE_NAME = 'Jux.Select.Value';

interface SelectValueProps<T = unknown>
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BasePrimitive.span>,
    'children'
  > {
  placeholder?: React.ReactNode;
  children?: (value: T) => React.ReactNode;
}

function ValueImpl<T>(
  props: SelectValueProps<T>,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>
) {
  const { placeholder, children, className, ...otherProps } = props;
  const selectContext = useSelectContext(VALUE_NAME) as SelectContextValue<T>;

  const renderValue = (val: T) => {
    // Always try to get the cloned element first
    const selectedElement =
      selectContext.selectedValueOptionElementsMap.current.get(
        JSON.stringify(val)
      );

    // display: contents is used in order to avoid the cloned element from being displayed as a block element

    if (selectedElement) {
      return (
        <BasePrimitive.span
          style={{ display: 'contents' }}
          ref={forwardedRef}
          {...otherProps}
          dangerouslySetInnerHTML={{ __html: selectedElement.innerHTML }}
        />
      );
    }

    // If no cloned element is available yet, use custom render function if provided
    if (children) {
      return children(val);
    }

    // Last resort fallback
    if (val && typeof val === 'object' && 'name' in val) {
      return (
        <BasePrimitive.span
          style={{ display: 'contents' }}
          ref={forwardedRef}
          {...otherProps}
        >
          {String((val as { name: string }).name)}
        </BasePrimitive.span>
      );
    }
    return (
      <BasePrimitive.span
        style={{ display: 'contents' }}
        ref={forwardedRef}
        {...otherProps}
      >
        {String(val)}
      </BasePrimitive.span>
    );
  };

  const value = useMemo(() => {
    if (isValueEmpty(selectContext.value)) {
      return (
        <BasePrimitive.span
          style={{ display: 'contents' }}
          ref={forwardedRef}
          {...otherProps}
        >
          {placeholder}
        </BasePrimitive.span>
      );
    }

    if (selectContext.multiple) {
      const selectedValues = selectContext.value as T[];
      return (
        <>
          {selectedValues.map((val) => (
            <React.Fragment key={JSON.stringify(val)}>
              {renderValue(val)}
            </React.Fragment>
          ))}
        </>
      );
    }

    return renderValue(selectContext.value as T);
  }, [
    selectContext.value,
    selectContext.multiple,
    selectContext.selectedValueOptionElementsMap.current.size,
    placeholder,
    children,
  ]);

  return <div className={className}>{value}</div>;
}

export const Value = React.forwardRef(ValueImpl) as typeof ValueImpl & {
  displayName: string;
};

Value.displayName = VALUE_NAME;