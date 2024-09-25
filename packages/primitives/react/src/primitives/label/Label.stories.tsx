import type { Meta, StoryObj } from '@storybook/react';
import * as Label from './Label';
import React from 'react';
import { styled } from '@mui/material';

const StyledLabelRoot = styled(Label.Root)({
  color: 'red',
  fontSize: 20,
});

const meta: Meta<typeof Label.Root> = {
  component: Label.Root,
  title: 'JUX/Primitives/Label',
};

export default meta;
type Story = StoryObj<typeof Label.Root>;

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
