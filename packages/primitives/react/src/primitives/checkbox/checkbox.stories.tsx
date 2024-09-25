import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import React from 'react';
import { css } from '@juxio/react-styled';

const rootStyles = css({
  all: 'unset',
  width: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '25px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  outline: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: '#fff',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
  '&:active': { boxShadow: `0 0 0 2px black` },

  '&[data-disabled]': {
    opacity: 0.7,
  },

  '.checked_icon': {
    display: 'none',
  },

  '.divider_icon': {
    display: 'none',
  },

  '&[data-state="checked"] .checked_icon': {
    display: 'block',
  },

  '&[data-disabled] .checked_icon': {
    color: 'grey',
  },

  '&[data-state="unchecked"] .checked_icon': {
    display: 'none',
  },

  '&[data-state="indeterminate"] .divider_icon': {
    display: 'block',
  },
});

const CheckIcon = ({ className }: { className: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="15"
      height="15"
    >
      <path
        d="M84.52 8.33L41.67 52.36L22.02 33.64L6.54 49.19l37.5 36.37L100 18.87z"
        fill="currentColor"
        fillRule={'evenodd'}
        clipRule={'evenodd'}
      />
    </svg>
  );
};

const DividerIcon = ({ className }: { className: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 2"
      width="15"
      height="100%"
    >
      <path d="M0 1 H100" stroke="currentColor" stroke-width="8" fill="none" />
    </svg>
  );
};

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  tags: ['autodocs'],
  title: 'JUX/Primitives/Checkbox',
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const StyledCheckbox: Story = {
  render: () => {
    return (
      <Checkbox className={rootStyles} defaultChecked={true}>
        <CheckIcon className={'checked_icon'} />
      </Checkbox>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
      true
    );
    return (
      <Checkbox
        className={rootStyles}
        checked={checked}
        onCheckedChange={setChecked}
      >
        <CheckIcon className={'checked_icon'} />
      </Checkbox>
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
      'indeterminate'
    );

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Checkbox
          className={rootStyles}
          checked={checked}
          onCheckedChange={setChecked}
        >
          <CheckIcon className={'checked_icon'} />
          <DividerIcon className={'divider_icon'} />
        </Checkbox>

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
    return (
      <Checkbox className={rootStyles} disabled defaultChecked>
        <CheckIcon className={'checked_icon'} />
      </Checkbox>
    );
  },
};
