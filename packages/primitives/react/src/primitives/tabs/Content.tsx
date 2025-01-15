import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useTabsContext } from './tabsContext';
import { TabsState } from './types';

const CONTENT_NAME = 'Jux.Tabs.Content';

interface ContentProps
  extends React.ComponentPropsWithoutRef<typeof BasePrimitive.div> {
  value: string;
  isSelected?: boolean;
}

export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  (props, forwardedRef) => {
    const { value, isSelected, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME);
    const isContentSelected = isSelected ?? context.value === value;

    return (
      <BasePrimitive.div
        role="tabpanel"
        aria-labelledby={`${context.baseId}-trigger-${value}`}
        hidden={!isContentSelected}
        id={`${context.baseId}-content-${value}`}
        data-state={isContentSelected ? TabsState.Active : TabsState.Inactive}
        data-orientation={context.orientation}
        tabIndex={0}
        ref={forwardedRef}
        {...contentProps}
      />
    );
  }
);

Content.displayName = CONTENT_NAME;
