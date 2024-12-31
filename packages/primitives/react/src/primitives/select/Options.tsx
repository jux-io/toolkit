import * as React from 'react';
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
};

export const Options = React.forwardRef<
  SelectOptionsElement,
  SelectOptionsProps
>((props, forwardedRef) => {
  const { open, popperContext } = useSelectContext(OPTIONS_NAME);
  const optionsRef = useMergeRefs(
    popperContext.floatingContext.refs.setFloating,
    forwardedRef
  );

  return (
    <FloatingPortal id={props.portalContainerId}>
      {open && (
        <FloatingFocusManager
          context={popperContext.floatingContext.context}
          modal={false}
        >
          <FloatingList
            elementsRef={popperContext.elementsRef}
            labelsRef={popperContext.labelsRef}
          >
            <RemoveScroll
              enabled={props.enableScrollLock}
              style={{ position: 'absolute' }}
            >
              <BasePrimitive.div
                ref={optionsRef}
                style={popperContext.floatingContext.floatingStyles}
                {...popperContext.interactions.getFloatingProps(props)}
              >
                {props.children}
              </BasePrimitive.div>
            </RemoveScroll>
          </FloatingList>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});

Options.displayName = OPTIONS_NAME;
