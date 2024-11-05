import * as React from 'react';
import { styled } from '@juxio/react-styled';
import { Button } from './Button';

// ModalFooter Props
interface ModalFooterProps extends React.ComponentPropsWithoutRef<'div'> {}

const StyledModalFooter = styled<'div', ModalFooterProps>('div', {
  root: {
    padding: 0,
    width: 'auto',
    height: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'normal 16px',
  },
  variants: [],
});

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter({ ...otherProps }, ref) {
    return (
      <StyledModalFooter ref={ref} {...otherProps}>
        <Button hierarchy={'primary'} disabled={false} />
        <Button hierarchy={'secondary'} disabled={false} />
      </StyledModalFooter>
    );
  }
);
