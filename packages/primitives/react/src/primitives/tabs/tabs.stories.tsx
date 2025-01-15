import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as Tabs from './index';
import { css } from '@juxio/react-styled';

const tabsStyles = css({
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
});

const tabListStyles = css({
  display: 'flex',
  borderBottom: '1px solid #e2e8f0',
});

const tabTriggerStyles = css({
  padding: '8px 16px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  '&[data-state="active"]': {
    borderBottom: '2px solid #4a5568',
    marginBottom: '-1px',
  },
  '&:hover': {
    backgroundColor: '#f7fafc',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.5)',
  },
});

const tabContentStyles = css({
  padding: '16px',
});

const meta: Meta<typeof Tabs.Root> = {
  component: Tabs.Root,
  tags: ['autodocs'],
  title: 'JUX/Primitives/Tabs',
};

export default meta;
type Story = StoryObj<typeof Tabs.Root>;

export const Basic: Story = {
  render: () => (
    <Tabs.Root defaultValue="tab1" className={tabsStyles}>
      <Tabs.List className={tabListStyles}>
        <Tabs.Trigger value="tab1" className={tabTriggerStyles}>
          Account
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" className={tabTriggerStyles}>
          Password
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" className={tabTriggerStyles}>
          Settings
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" className={tabContentStyles}>
        Account settings and preferences
      </Tabs.Content>
      <Tabs.Content value="tab2" className={tabContentStyles}>
        Change your password here
      </Tabs.Content>
      <Tabs.Content value="tab3" className={tabContentStyles}>
        Other settings
      </Tabs.Content>
    </Tabs.Root>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs.Root
      defaultValue="tab1"
      orientation="vertical"
      className={css({
        display: 'flex',
        gap: '16px',
        width: '400px',
      })}
    >
      <Tabs.List
        className={css({
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #e2e8f0',
        })}
      >
        <Tabs.Trigger
          value="tab1"
          className={css({
            '&[data-state="active"]': {
              borderRight: '2px solid #4a5568',
              marginRight: '-1px',
              borderBottom: 'none',
            },
          })}
        >
          Account
        </Tabs.Trigger>
        <Tabs.Trigger
          value="tab2"
          className={css({
            '&[data-state="active"]': {
              borderRight: '2px solid #4a5568',
              marginRight: '-1px',
              borderBottom: 'none',
            },
          })}
        >
          Password
        </Tabs.Trigger>
      </Tabs.List>
      <div>
        <Tabs.Content value="tab1" className={tabContentStyles}>
          Account settings and preferences
        </Tabs.Content>
        <Tabs.Content value="tab2" className={tabContentStyles}>
          Change your password here
        </Tabs.Content>
      </div>
    </Tabs.Root>
  ),
};
