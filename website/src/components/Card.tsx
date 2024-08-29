import React from 'react';
import { css, styled } from '@juxio/react-styled';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const StyledCard = styled('div', {
  root: {
    border: '1px solid var(--sl-color-gray-5)',
    borderRadius: '16px',
    backgroundColor: 'var(--sl-color-black)',
    padding: '1.5rem',
    flexDirection: 'column',
    gap: 'clamp(0.5rem, calc(0.125rem + 1vw), 1rem)',
  },
});

export const Card = React.forwardRef<HTMLDivElement, Props>(
  function Card(props) {
    return (
      <StyledCard>
        {props.title}
        {props.children}
      </StyledCard>
    );
  }
);
