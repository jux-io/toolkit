import * as React from 'react';
import { styled, css } from '@juxio/react-styled';
import { ModalHeader } from './ModalHeader';
import { ModalFooter } from './ModalFooter';

// RegularModal Props
interface RegularModalProps extends React.ComponentPropsWithoutRef<'div'> {
  body?: React.ReactNode;
}

const body_e465bc8c = css({
  width: 'auto',
  height: 'auto',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  padding: '16px 0px 16px 0px',
  gap: '8px 0px',
});

const StyledRegularModal = styled<'div', RegularModalProps>(
  'div',
  {
    root: {
      width: 'auto',
      height: 'auto',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      padding: '20px 20px 20px 20px',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      borderStyle: 'none',
      borderRadius: '8px',
      gap: '16px normal',
    },
    variants: [],
  },
  {
    // Prevent non-valid HTML props from being passed to the DOM
    shouldForwardProp: (propName) => !['body'].includes(propName),
  }
);

export const RegularModal = React.forwardRef<HTMLDivElement, RegularModalProps>(
  function RegularModal({ body = undefined, ...otherProps }, ref) {
    return (
      <StyledRegularModal ref={ref} {...otherProps}>
        <ModalHeader />
        {body ? <div className={body_e465bc8c}>{body}</div> : null}
        <ModalFooter />
      </StyledRegularModal>
    );
  }
);
