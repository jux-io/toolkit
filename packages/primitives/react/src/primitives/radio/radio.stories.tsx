import type { Meta, StoryObj } from '@storybook/react';
import { RadioState, Radio } from './Radio';
import React from 'react';
import { css } from '@juxio/react-styled';

const rootStyles = css({
  all: 'unset',
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: '1.5px solid #9E9E9E',
  outline: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: '#fff',

  '&[data-state="checked"]': {
    borderColor: '#058FF2',
    backgroundColor: '#058FF2',
    boxShadow: 'inset 0 0 0 2px #fff',
  },

  '&[data-state="indeterminate"]': {
    borderColor: '#058FF2',
    backgroundColor: '#058FF2',
    boxShadow: 'inset 0 0 0 2px #fff',
    '&::after': {
      content: '""',
      display: 'block',
      width: '8px',
      height: '2px',
      backgroundColor: '#fff',
    },
  },

  '&:hover[data-state="unchecked"]': {
    borderColor: '#272727',
  },
  '&:hover[data-state="checked"], &:hover[data-state="indeterminate"]': {
    borderColor: '#0470C2',
    backgroundColor: '#0470C2',
  },

  '&:active[data-state="unchecked"]': {
    borderColor: '#1A1A1A',
  },
  '&:active[data-state="checked"], &:active[data-state="indeterminate"]': {
    borderColor: '#035592',
    backgroundColor: '#035592',
  },

  '&[data-disabled]': {
    cursor: 'default',
    '&[data-state="checked"], &[data-state="indeterminate"]': {
      borderColor: '#D9EFFF',
      backgroundColor: '#D9EFFF',
    },
    '&[data-state="unchecked"]': {
      borderColor: '#BDBDBD',
    },
  },
});

const meta: Meta<typeof Radio> = {
  component: Radio,
  tags: ['autodocs'],
  title: 'JUX/Primitives/Radio',
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const StyledRadio: Story = {
  render: () => {
    return <Radio className={rootStyles} defaultChecked={true} />;
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<RadioState>(true);
    return (
      <Radio
        className={rootStyles}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const RadioGroup: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState('1');

    return (
      <div
        role="radiogroup"
        aria-label="Sample radio group"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio
            id="radio-1"
            className={rootStyles}
            checked={selectedValue === '1'}
            onCheckedChange={() => setSelectedValue('1')}
            value="1"
            name="radio-group"
          />
          <label htmlFor="radio-1">Option 1</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio
            id="radio-2"
            className={rootStyles}
            checked={selectedValue === '2'}
            onCheckedChange={() => setSelectedValue('2')}
            value="2"
            name="radio-group"
          />
          <label htmlFor="radio-2">Option 2</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio
            id="radio-3"
            className={rootStyles}
            checked={selectedValue === '3'}
            onCheckedChange={() => setSelectedValue('3')}
            value="3"
            name="radio-group"
          />
          <label htmlFor="radio-3">Option 3</label>
        </div>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Use keyboard navigation (Tab, Space, Enter) to interact with the radio
          buttons
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return <Radio className={rootStyles} disabled defaultChecked />;
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<RadioState>('indeterminate');

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Radio
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
