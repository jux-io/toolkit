import type { Meta, StoryObj } from '@storybook/react';
import { RadioState, Radio } from './Radio';
import React from 'react';
import {
  RadioButtonStyles,
  RadioLabelStyles,
  RadioWrapperStyles,
} from './radio.stories.styles';

const meta: Meta<typeof Radio> = {
  component: Radio,
  tags: ['autodocs'],
  title: 'JUX/Primitives/Radio',
  parameters: {
    docs: {
      description: {
        component:
          'A radio button component with support for various states including checked, unchecked, indeterminate, and disabled.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: () => {
    return (
      <div className={RadioWrapperStyles}>
        <Radio
          className={RadioButtonStyles}
          value="default"
          id="default-radio"
        />
        <label className={RadioLabelStyles} htmlFor="default-radio">
          Default Radio
        </label>
      </div>
    );
  },
};

export const Checked: Story = {
  render: () => {
    return (
      <div className={RadioWrapperStyles}>
        <Radio
          className={RadioButtonStyles}
          value="checked"
          defaultChecked
          id="checked-radio"
        />
        <label className={RadioLabelStyles} htmlFor="checked-radio">
          Checked Radio
        </label>
      </div>
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<RadioState>('indeterminate');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className={RadioWrapperStyles}>
          <Radio
            className={RadioButtonStyles}
            checked={checked}
            onCheckedChange={setChecked}
            value="indeterminate"
            id="indeterminate-radio"
          />
          <label className={RadioLabelStyles} htmlFor="indeterminate-radio">
            Indeterminate Radio
          </label>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setChecked(false)}>Set Unchecked</button>
          <button onClick={() => setChecked('indeterminate')}>
            Set Indeterminate
          </button>
          <button onClick={() => setChecked(true)}>Set Checked</button>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className={RadioWrapperStyles} data-disabled>
          <Radio
            className={RadioButtonStyles}
            disabled
            value="disabled-unchecked"
            id="disabled-radio"
          />
          <label className={RadioLabelStyles} htmlFor="disabled-radio">
            Disabled Radio (Unchecked)
          </label>
        </div>
        <div className={RadioWrapperStyles} data-disabled>
          <Radio
            className={RadioButtonStyles}
            disabled
            defaultChecked
            value="disabled-checked"
            id="disabled-checked-radio"
          />
          <label className={RadioLabelStyles} htmlFor="disabled-checked-radio">
            Disabled Radio (Checked)
          </label>
        </div>
        <div className={RadioWrapperStyles} data-disabled>
          <Radio
            className={RadioButtonStyles}
            checked="indeterminate"
            disabled
            value="disabled-indeterminate"
            id="disabled-indeterminate-radio"
          />
          <label
            className={RadioLabelStyles}
            htmlFor="disabled-indeterminate-radio"
          >
            Disabled Radio (Indeterminate)
          </label>
        </div>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<RadioState>(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className={RadioWrapperStyles}>
          <Radio
            className={RadioButtonStyles}
            checked={checked}
            onCheckedChange={setChecked}
            value="controlled"
            id="controlled-radio"
          />
          <label className={RadioLabelStyles} htmlFor="controlled-radio">
            Controlled Radio (Checked: {String(checked)})
          </label>
        </div>
        <button onClick={() => setChecked((prev) => !prev)}>
          Toggle Radio
        </button>
      </div>
    );
  },
};
