import * as React from 'react';
import { styled, css } from '@juxio/react-styled';

// ModalHeader Props
interface ModalHeaderProps extends React.ComponentPropsWithoutRef<'div'> {}

const text_3780c725 = css({
  color: '#000000',
  width: 'auto',
  height: 'auto',
  fontFamily: 'Inter',
  fontSize: '20px',
  lineHeight: '130%',
  display: 'inline-block',
  overflowWrap: 'break-word',
  whiteSpace: 'pre-wrap',
});

const StyledModalHeader = styled<'div', ModalHeaderProps>('div', {
  root: {
    padding: 0,
    width: 'auto',
    height: 'auto',
    display: 'flex',
  },
  variants: [
    {
      props: {},
      style: {
        [`.${text_3780c725}`]: {
          fontSize: '18px',
          color: 'rgba(143, 143, 143, 1)',
        },
      },
    },
  ],
});

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader({ ...otherProps }, ref) {
    return (
      <StyledModalHeader ref={ref} {...otherProps}>
        <span className={text_3780c725}>header title</span>
      </StyledModalHeader>
    );
  }
);
