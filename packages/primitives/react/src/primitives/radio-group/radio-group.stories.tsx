import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Root as RadioGroup } from './RadioGroup';
import { Item as RadioGroupItem } from './RadioGroupItem';
import {
  RadioButtonStyles,
  RadioLabelStyles,
  RadioWrapperStyles,
} from '../radio/radio.stories.styles';
import {
  RadioGroupContainerStyles,
  RadioGroupHorizontalContainerStyles,
} from './radio-group.stories.styles';

const meta: Meta<typeof RadioGroup> = {
  title: 'JUX/Primitives/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A form control for selecting a single option from a list of radio buttons. Implements the WAI-ARIA radio group pattern for accessibility.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup name="default-group">
      <div className={RadioGroupContainerStyles}>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="radio1"
            value="option1"
          />
          <label className={RadioLabelStyles} htmlFor="radio1">
            Option 1
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="radio2"
            value="option2"
          />
          <label className={RadioLabelStyles} htmlFor="radio2">
            Option 2
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="radio3"
            value="option3"
          />
          <label className={RadioLabelStyles} htmlFor="radio3">
            Option 3
          </label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup name="horizontal-group" direction="horizontal">
      <div className={RadioGroupHorizontalContainerStyles}>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="h-radio1"
            value="option1"
          />
          <label className={RadioLabelStyles} htmlFor="h-radio1">
            Option 1
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="h-radio2"
            value="option2"
          />
          <label className={RadioLabelStyles} htmlFor="h-radio2">
            Option 2
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="h-radio3"
            value="option3"
          />
          <label className={RadioLabelStyles} htmlFor="h-radio3">
            Option 3
          </label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <RadioGroup name="default-value-group" defaultValue="option2">
      <div className={RadioGroupContainerStyles}>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="dv-radio1"
            value="option1"
          />
          <label className={RadioLabelStyles} htmlFor="dv-radio1">
            Option 1
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="dv-radio2"
            value="option2"
          />
          <label className={RadioLabelStyles} htmlFor="dv-radio2">
            Option 2 (Default)
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="dv-radio3"
            value="option3"
          />
          <label className={RadioLabelStyles} htmlFor="dv-radio3">
            Option 3
          </label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup name="disabled-group" disabled>
      <div className={RadioGroupContainerStyles}>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="d-radio1"
            value="option1"
          />
          <label className={RadioLabelStyles} htmlFor="d-radio1">
            Option 1
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="d-radio2"
            value="option2"
          />
          <label className={RadioLabelStyles} htmlFor="d-radio2">
            Option 2
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="d-radio3"
            value="option3"
          />
          <label className={RadioLabelStyles} htmlFor="d-radio3">
            Option 3
          </label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <RadioGroup name="disabled-item-group">
      <div className={RadioGroupContainerStyles}>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="di-radio1"
            value="option1"
          />
          <label className={RadioLabelStyles} htmlFor="di-radio1">
            Option 1
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="di-radio2"
            value="option2"
            disabled
          />
          <label className={RadioLabelStyles} htmlFor="di-radio2">
            Option 2 (Disabled)
          </label>
        </div>
        <div className={RadioWrapperStyles}>
          <RadioGroupItem
            className={RadioButtonStyles}
            id="di-radio3"
            value="option3"
          />
          <label className={RadioLabelStyles} htmlFor="di-radio3">
            Option 3
          </label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('option1');
    return (
      <RadioGroup
        name="controlled-group"
        value={value}
        onValueChange={setValue}
      >
        <div className={RadioGroupContainerStyles}>
          <div className={RadioWrapperStyles}>
            <RadioGroupItem
              className={RadioButtonStyles}
              id="c-radio1"
              value="option1"
            />
            <label className={RadioLabelStyles} htmlFor="c-radio1">
              Option 1
            </label>
          </div>
          <div className={RadioWrapperStyles}>
            <RadioGroupItem
              className={RadioButtonStyles}
              id="c-radio2"
              value="option2"
            />
            <label className={RadioLabelStyles} htmlFor="c-radio2">
              Option 2
            </label>
          </div>
          <div className={RadioWrapperStyles}>
            <RadioGroupItem
              className={RadioButtonStyles}
              id="c-radio3"
              value="option3"
            />
            <label className={RadioLabelStyles} htmlFor="c-radio3">
              Option 3
            </label>
          </div>
        </div>
      </RadioGroup>
    );
  },
};
