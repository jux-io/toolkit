import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useMergeRefs } from '../../hooks/useMergeRefs';
import * as ReactDOM from 'react-dom';
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
      <FloatingPortal id={props.portalContainerId}>
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
});

Options.displayName = OPTIONS_NAME;
