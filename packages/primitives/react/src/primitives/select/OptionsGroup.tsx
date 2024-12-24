/**
 * Select.OptionsGroup
 */
import * as React from 'react';
import { useId } from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { createCustomContext } from '../../utils/createCustomContext';

export const OPTIONS_GROUP_NAME = 'Jux.Select.OptionsGroup';

export interface SelectOptionsGroupContextValue {
  groupId: string;
}

const {
  Provider: SelectOptionsGroupProvider,
  useContext: useSelectOptionsGroupContext,
} = createCustomContext<SelectOptionsGroupContextValue>(OPTIONS_GROUP_NAME);

type SelectOptionsGroupElement = React.ElementRef<typeof BasePrimitive.div>;
export const OptionsGroup = React.forwardRef<
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

export const OptionsGroupLabel = React.forwardRef<
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
