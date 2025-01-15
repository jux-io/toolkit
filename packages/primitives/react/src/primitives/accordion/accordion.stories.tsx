import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as Accordion from './index';
import { css } from '@juxio/react-styled';

const accordionStyles = css({
  width: '300px',
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
});

const itemStyles = css({
  overflow: 'hidden',
  marginTop: '1px',
  '&:first-child': {
    marginTop: 0,
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  '&:last-child': {
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
  },
  '&:focus-within': {
    position: 'relative',
    zIndex: 1,
  },
});

const headerStyles = css({
  display: 'flex',
});

const triggerStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  fontSize: '15px',
  lineHeight: 1,
  backgroundColor: 'white',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f7fafc',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.5)',
  },
  '[data-state=open] &': {
    backgroundColor: '#f7fafc',
  },
  '[data-disabled] &': {
    cursor: 'not-allowed',
    color: '#a0aec0',
  },
});

const chevronStyles = css({
  transition: 'transform 300ms',
  '[data-state=open] &': {
    transform: 'rotate(180deg)',
  },
});

const contentStyles = css({
  overflow: 'hidden',
  fontSize: '14px',
  backgroundColor: '#f8f9fa',
  '[data-state=open] &': {
    animation: 'slideDown 300ms ease-out',
  },
  '[data-state=closed] &': {
    animation: 'slideUp 300ms ease-out',
  },
  '@keyframes slideDown': {
    from: { height: 0 },
    to: { height: 'var(--jux-accordion-content-height)' },
  },
  '@keyframes slideUp': {
    from: { height: 'var(--jux-accordion-content-height)' },
    to: { height: 0 },
  },
});

const contentInnerStyles = css({
  padding: '16px 20px',
});

const meta: Meta<typeof Accordion.Root> = {
  component: Accordion.Root,
  tags: ['autodocs'],
  title: 'JUX/Primitives/Accordion',
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
    },
    collapsible: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
    direction: {
      control: 'radio',
      options: ['ltr', 'rtl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion.Root>;

const AccordionItem = ({
  value,
  headerLabel,
  children,
  disabled,
  open,
}: {
  value: string;
  headerLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  open?: boolean;
}) => (
  <Accordion.Item
    open={open}
    value={value}
    className={itemStyles}
    disabled={disabled}
  >
    <Accordion.Header className={headerStyles}>
      <Accordion.Trigger className={triggerStyles}>
        {headerLabel}
        <ChevronIcon className={chevronStyles} />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className={contentStyles}>
      <div className={contentInnerStyles}>{children}</div>
    </Accordion.Content>
  </Accordion.Item>
);

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | undefined>('item-1');

    const onValueChange = (value: string) => {
      setValue(value);
    };

    return (
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <Accordion.Root
          type="single"
          collapsible
          value={value}
          onValueChange={onValueChange}
          className={accordionStyles}
        >
          <AccordionItem
            value="item-1"
            open={value === 'item-1'}
            headerLabel="Controlled section 1"
          >
            You can control me with the buttons
          </AccordionItem>
          <AccordionItem
            value="item-2"
            open={value === 'item-2'}
            headerLabel="Controlled section 2"
          >
            And me too!
          </AccordionItem>
        </Accordion.Root>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setValue('item-1')}>Open Section 1</button>
          <button onClick={() => setValue('item-2')}>Open Section 2</button>
          <button onClick={() => setValue(undefined)}>Close All</button>
        </div>
      </div>
    );
  },
};

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
      fill="currentColor"
    />
  </svg>
);
