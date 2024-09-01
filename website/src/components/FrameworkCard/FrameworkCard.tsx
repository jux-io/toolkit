import React from 'react';
import { css, styled } from '@juxio/react-styled';

interface Props {
  title: string;
  href: string;
  children?: React.ReactNode;
}

const logoContainer = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem',
});

export const StyledCard = styled<'a', Omit<Props, 'title'>>('a', {
  root: {
    aspectRatio: '1/1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textDecoration: 'none',
    fontWeight: 'bold',
    gap: '4px',

    [`.${logoContainer}`]: {
      height: 'fit-content',
      width: 'fit-content',
      border: '1px solid var(--sl-color-gray-5)',
      borderRadius: '50%',
      backgroundColor: 'var(--sl-color-black)',
      borderWidth: '2px',

      transition: 'border-color, background 0.5s ease',

      '&:hover': {
        background: 'var(--sl-color-gray-7, var(--sl-color-gray-6))',
        borderColor: 'var(--sl-color-white)',
      },
    },
  },
});

export const FrameworkCard = React.forwardRef<HTMLAnchorElement, Props>(
  function Card(props, ref) {
    return (
      <StyledCard href={props.href} ref={ref}>
        {/*<span>{props.title}</span>*/}
        <div className={logoContainer}>{props.children}</div>
        <span>{props.title}</span>
      </StyledCard>
    );
  }
);
