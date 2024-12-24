import type { Meta, StoryObj } from '@storybook/react';
import { Toggle, ToggleState } from './Toggle';
import React from 'react';
import { css } from '@juxio/react-styled';

const rootStyles = css({
  all: 'unset',
  width: '42px',
  height: '25px',
  backgroundColor: '#E4E4E7',
  borderRadius: '9999px',
  position: 'relative',
  boxShadow: `0 2px 10px rgba(0, 0, 0, 0.1)`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out',

  '&[data-state="checked"]': {
    backgroundColor: '#22C55E',
  },

  '&[data-disabled]': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  '&::after': {
    content: '""',
    display: 'block',
    width: '21px',
    height: '21px',
    backgroundColor: 'white',
    borderRadius: '9999px',
    boxShadow: `0 2px 2px rgba(0, 0, 0, 0.1)`,
    transition: 'transform 0.2s ease-in-out',
    transform: 'translateX(2px)',
    willChange: 'transform',
  },

  '&[data-state="checked"]::after': {
    transform: 'translateX(19px)',
  },

  '&[data-state="indeterminate"]::after': {
    transform: 'translateX(10.5px)',
  },
});

const meta: Meta<typeof Toggle> = {
  component: Toggle,
  tags: ['autodocs'],
  title: 'JUX/Primitives/Toggle',
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const StyledToggle: Story = {
  render: () => {
    return <Toggle className={rootStyles} defaultChecked={true} />;
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<ToggleState>(true);
    return (
      <Toggle
        className={rootStyles}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<ToggleState>('indeterminate');

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Toggle
          className={rootStyles}
          checked={checked}
          onCheckedChange={setChecked}
        />

        <button
          type="button"
          style={{
            width: '200px',
          }}
          onClick={() =>
            setChecked((prevIsChecked) =>
              prevIsChecked === 'indeterminate' ? false : 'indeterminate'
            )
          }
        >
          Toggle indeterminate
        </button>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return <Toggle className={rootStyles} disabled defaultChecked />;
  },
};
