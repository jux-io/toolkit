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
        color: 'var(--jux-color-text-strong)',
      },
    },
    {
      props: { selected: false },
      style: {
        border: 'none',
        color: 'var(--jux-color-text-weak)',
        backgroundColor: 'transparent',
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
          href={'/'}
          onClick={() => handleClick('welcome')}
          selected={selectedButton === 'welcome'}
        >
          Welcome
        </Button>
        <Button
          href={'/designers/quickstart'}
          onClick={() => handleClick('designers')}
          selected={selectedButton === 'designers'}
        >
          Designers
        </Button>
        <Button
          href={'/developers/quickstart'}
          onClick={() => handleClick('developers')}
          selected={selectedButton === 'developers'}
        >
          Developers
        </Button>
      </div>
    </div>
  );
};

export default AnimatedButtonGroup;
