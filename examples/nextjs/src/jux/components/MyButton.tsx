import * as React from 'react';
import { styled, css, type Merge } from '@juxio/react-styled';
import { LogoJuxButton31 } from './LogoJuxButton31';

export interface MyButtonVariants {
  disabled: boolean;
  hierarchy: 'primary' | 'secondary';
}

export type MyButtonProps = Merge<
  React.HTMLAttributes<HTMLButtonElement>,
  MyButtonVariants
>;

const logo_jux_button31_2df60e63 = css({
  display: 'inline-block',
  color: '#FFFFFF',
});

const StyledMyButton = styled<'button', MyButtonProps>(
  'button',
  {
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto',
      height: '36px',
      fontFamily: 'Inter',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: '20px',
      padding: '8px 16px',
      borderRadius: '4px',
      borderStyle: 'none',
      gap: '8px',
      cursor: 'pointer',
      outline: 'none',
      '&:active': {
        outline: 'none',
      },
    },
    variants: [
      {
        props: {
          hierarchy: 'primary',
          disabled: false,
        },
        style: {
          backgroundColor: 'rgba(223, 223, 234, 1)',
          [`.${logo_jux_button31_2df60e63}`]: {
            width: '88px',
            height: '35px',
          },
          '&:hover': {
            backgroundColor: '#2740CD',
          },
          '&:active': {
            backgroundColor: '#1B32B8',
          },
        },
      },
      {
        props: {
          hierarchy: 'secondary',
          disabled: false,
        },
        style: {
          backgroundColor: '#9C9C9C',
          '&:hover': {
            backgroundColor: '#6A6A6A',
          },
          '&:active': {
            backgroundColor: '#3B3B3B',
          },
        },
      },
      {
        props: {
          hierarchy: 'primary',
          disabled: true,
        },
        style: {
          backgroundColor: '#98A6F9',
          cursor: 'default',
        },
      },
      {
        props: {
          hierarchy: 'secondary',
          disabled: true,
        },
        style: {
          backgroundColor: '#C8C8C8',
          cursor: 'default',
        },
      },
    ],
  },
  {
    // Prevent non-valid HTML props from being passed to the DOM
    shouldForwardProp: (propName) => !['hierarchy'].includes(propName),
  }
);

export const MyButton = React.forwardRef<HTMLButtonElement, MyButtonProps>(
  function MyButton(
    { disabled = false, hierarchy = 'primary', ...otherProps },
    ref
  ) {
    return (
      <StyledMyButton
        disabled={disabled}
        hierarchy={hierarchy}
        ref={ref}
        {...otherProps}
      >
        <LogoJuxButton31 className={logo_jux_button31_2df60e63} />
      </StyledMyButton>
    );
  }
);
