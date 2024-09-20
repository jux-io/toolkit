import { useState } from 'react';
import { css, styled } from '@juxio/react-styled';

const Button = styled('a', {
  root: {
    padding: '0 16px',
    borderRadius: '16px',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'transparent',
    transition: 'background-color 0.3s ease',
  },
  variants: [
    {
      props: { selected: true },
      style: {
        border: '1px solid',
        backgroundColor: 'var(--sl-color-text-accent)',
        color: 'var(--sl-color-text-invert)',
      },
    },
    {
      props: { selected: false },
      style: {
        border: 'none',
        color: 'var(--sl-color-gray-600)',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'var(--sl-color-gray-5)',
        },
      },
    },
  ],
});

const AnimatedButtonGroup = ({ current }: { current: string }) => {
  const [selectedButton, setSelectedButton] = useState(current);

  const handleClick = (name: string) => {
    setSelectedButton(name);
  };

  return (
    <div
      className={css({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
      })}
    >
      <div className={css({ display: 'flex', gap: '8px' })}>
        <Button
          href={'/developers/quickstart'}
          onClick={() => handleClick('developers')}
          selected={selectedButton === 'developers'}
        >
          Developers
        </Button>
        <Button
          href={'/editor'}
          onClick={() => handleClick('editor')}
          selected={selectedButton === 'editor'}
        >
          Editor
        </Button>
      </div>
    </div>
  );
};

export default AnimatedButtonGroup;
