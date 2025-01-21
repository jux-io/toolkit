import * as React from 'react';
import { styled, css } from '@juxio/react-styled';
import { LeadingIcon } from './LeadingIcon';
import { TrailingIcon } from './TrailingIcon';

// MyButton Props
interface MyButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  disabled?: boolean;
  hierarchy?: 'primary' | 'secondary';
}

const leading_icon_ec9c55d5 = css({
  display: 'inline-block',
  color: '#FFFFFF',
  _name: 'leading_icon_ec9c55d5',
});

const trailing_icon_799b825e = css({
  display: 'inline-block',
  color: '#FFFFFF',
  _name: 'trailing_icon_799b825e',
});

const button_label_b6045857 = css({
  fontFamily: 'Inter',
  fontWeight: '500',
  fontStyle: 'normal',
  fontSize: '14px',
  lineHeight: '20px',
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
          backgroundColor: '#3851DD',
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
        <LeadingIcon className={leading_icon_ec9c55d5} />
        <span className={button_label_b6045857}>Button</span>
        <TrailingIcon className={trailing_icon_799b825e} />
      </StyledMyButton>
    );
  }
);
