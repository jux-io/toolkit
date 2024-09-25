import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';
import React from 'react';
import { styled } from '@juxio/react-styled';

const StyledLabelRoot = styled(Label, {
  root: {
    color: 'red',
    fontSize: 20,
  },
});

const meta: Meta<typeof Label> = {
  component: Label,
  title: 'JUX/Primitives/Label',
};

export default meta;
type Story = StoryObj<typeof Label>;

const LabelWithCheckbox = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      <StyledLabelRoot htmlFor={'input'}>Hello I am activator</StyledLabelRoot>
      <input id={'input'} />
    </div>
  );
};

export const WithInput: Story = {
  render: () => <LabelWithCheckbox />,
};
