import * as React from 'react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useTabsContext } from './tabsContext';
import { Keys } from '../../utils/keyboard';
import { globalEventHandler } from '../../utils/globalEventHandler';

const LIST_NAME = 'Jux.Tabs.List';

export const List = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePrimitive.div>
>((props, forwardedRef) => {
  const { orientation } = useTabsContext(LIST_NAME);

  return (
    <BasePrimitive.div
      role="tablist"
      aria-orientation={orientation}
      ref={forwardedRef}
      {...props}
      onKeyDown={globalEventHandler(props.onKeyDown, (event) => {
        // Handle keyboard navigation
        if (
          event.key === Keys.ArrowDown ||
          event.key === Keys.ArrowRight ||
          event.key === Keys.ArrowUp ||
          event.key === Keys.ArrowLeft
        ) {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const triggers = Array.from(
            target.parentElement?.querySelectorAll('[role="tab"]') || []
          );
          const currentIndex = triggers.indexOf(target);

          let nextIndex: number;
          if (orientation === 'horizontal') {
            if (event.key === Keys.ArrowRight) {
              nextIndex = (currentIndex + 1) % triggers.length;
            } else if (event.key === Keys.ArrowLeft) {
              nextIndex =
                (currentIndex - 1 + triggers.length) % triggers.length;
            } else {
              return;
            }
          } else {
            if (event.key === Keys.ArrowDown) {
              nextIndex = (currentIndex + 1) % triggers.length;
            } else if (event.key === Keys.ArrowUp) {
              nextIndex =
                (currentIndex - 1 + triggers.length) % triggers.length;
            } else {
              return;
            }
          }

          (triggers[nextIndex] as HTMLElement).focus();
        }
      })}
    />
  );
});

List.displayName = LIST_NAME;
