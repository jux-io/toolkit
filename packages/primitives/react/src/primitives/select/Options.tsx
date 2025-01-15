import React, { forwardRef } from 'react';
import { useMergeRefs } from '../../hooks/useMergeRefs';
import { RemoveScroll } from 'react-remove-scroll';
import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
} from '@floating-ui/react';
import { BasePrimitive } from '../base/BasePrimitives';
import { useSelectContext } from './selectContext';

const OPTIONS_NAME = 'Jux.Select.Options';

type SelectOptionsElement = React.ElementRef<typeof BasePrimitive.div>;
export type SelectOptionsProps = React.ComponentPropsWithoutRef<
  typeof BasePrimitive.div
> & {
  portalContainerId?: string;
  enableScrollLock?: boolean;
  open?: boolean;
};

export const Options = forwardRef<SelectOptionsElement, SelectOptionsProps>(
  (props, forwardedRef) => {
    const { open, popperContext, portalContainerId } =
      useSelectContext(OPTIONS_NAME);
    const optionsRef = useMergeRefs(
      popperContext.floatingContext.refs.setFloating,
      forwardedRef
    );

    const isOpen = props.open ?? open;

    const floatingPortalId = props.portalContainerId ?? portalContainerId;

    const divStyles = {
      ...popperContext.floatingContext.floatingStyles,
      ...(isOpen ? {} : { display: 'none' }),
    };

    return (
      <FloatingPortal id={floatingPortalId}>
        <FloatingFocusManager
          context={popperContext.floatingContext.context}
          modal={false}
        >
          <FloatingList
            elementsRef={popperContext.elementsRef}
            labelsRef={popperContext.labelsRef}
          >
            <RemoveScroll enabled={props.enableScrollLock}>
              <BasePrimitive.div
                ref={optionsRef}
                style={divStyles}
                {...popperContext.interactions.getFloatingProps(props)}
              >
                {props.children}
              </BasePrimitive.div>
            </RemoveScroll>
          </FloatingList>
        </FloatingFocusManager>
      </FloatingPortal>
    );
  }
);

Options.displayName = OPTIONS_NAME;
