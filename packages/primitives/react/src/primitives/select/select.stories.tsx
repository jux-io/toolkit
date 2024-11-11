import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as Select from './Select';
import { css } from '@juxio/react-styled';

const triggerStyles = css({
  fontFamily: 'Inter',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'transparent',
  fontSize: '14px',
  border: '1px solid lightgrey',
  borderRadius: '8px',
  cursor: 'default',
  userSelect: 'none',
  paddingInline: '0.75rem',
  width: '320px',
  height: '38px',

  '&:focus': {
    outline: 'none',
    border: '1px solid darkviolet',
  },
});

const optionsStyles = css({
  backgroundColor: 'white',
  border: '1px solid darkgrey',
  borderRadius: '8px',
  padding: '4px 0',
  flexDirection: 'column',
  outline: 'none',
  maxHeight: '200px',
  overflow: 'auto',
  width: 'var(--jux-select-trigger-width)',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const optionStyle: any = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  lineHeight: '1',
  cursor: 'default',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  padding: '8px 0',
  paddingLeft: '16px',
};

const optionStyles = css({
  ...optionStyle,

  '&:focus': {
    outline: 'none',
    backgroundColor: '#f1f1f1',
  },
});

const selectLabelStyles = css({
  ...optionStyle,
  color: 'grey',
  fontSize: '12px',
});

const optionIndicatorStyles = css({
  position: 'absolute',
  right: '16px',
});

const multipleValuesStyles = css({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

const openIconStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const meta: Meta<typeof Select.Root> = {
  component: Select.Root,
  tags: ['autodocs'],
  title: 'JUX/Primitives/Select',
};

export default meta;

type Story = StoryObj<typeof Select>;

const colors = [
  'Red',
  'Green',
  'Blue',
  'Yellow',
  'Purple',
  'Orange',
  'Pink',
  'Brown',
  'Black',
  'White',
  'Gray',
  'Cyan',
  'Magenta',
  'Lime',
  'Maroon',
  'Navy',
  'Olive',
  'Teal',
  'Silver',
  'Gold',
];

export const Basic: Story = {
  render: () => {
    return (
      <>
        <Select.Root placement={'bottom'} sideOffset={8}>
          <Select.Trigger className={triggerStyles}>
            <Select.Value placeholder={'Select a Color'} />
            <span className={openIconStyles}>
              <OpenIcon />
            </span>
          </Select.Trigger>
          <Select.Options className={optionsStyles}>
            {colors.map((name) => (
              <Select.Option key={name} label={name} className={optionStyles}>
                <span>{name}</span>
                <Select.OptionIndicator className={optionIndicatorStyles}>
                  <CheckIcon />
                </Select.OptionIndicator>
              </Select.Option>
            ))}
          </Select.Options>
        </Select.Root>
      </>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    return (
      <>
        <Select.Root
          placement={'bottom'}
          sideOffset={8}
          closeOnSelect={false}
          multiple
        >
          <Select.Trigger className={triggerStyles}>
            <Select.Value
              placeholder={'Select a Color'}
              className={multipleValuesStyles}
            />
            <span className={openIconStyles}>
              <OpenIcon />
            </span>
          </Select.Trigger>
          <Select.Options className={optionsStyles}>
            {colors.map((name) => (
              <Select.Option key={name} label={name} className={optionStyles}>
                <span>{name}</span>
                <Select.OptionIndicator className={optionIndicatorStyles}>
                  <CheckIcon />
                </Select.OptionIndicator>
              </Select.Option>
            ))}
          </Select.Options>
        </Select.Root>
      </>
    );
  },
};

export const InsideForm: Story = {
  render: () => {
    const [selected, setSelected] = useState<Record<string, string[]>>({});

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <form
          style={{
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'column',
            gap: '8px',
          }}
          onSubmit={(e) => {
            const formData = new FormData(e.currentTarget);
            setSelected({
              color: formData.getAll('color') as string[],
            });
            e.preventDefault();
          }}
        >
          <Select.Root
            placement={'bottom'}
            sideOffset={8}
            name={'color'}
            closeOnSelect={false}
            required
            multiple
          >
            <Select.Trigger className={triggerStyles}>
              <Select.Value
                placeholder={'Select a Color'}
                className={multipleValuesStyles}
              />
              <span className={openIconStyles}>
                <OpenIcon />
              </span>
            </Select.Trigger>
            <Select.Options className={optionsStyles}>
              {colors.map((name) => (
                <Select.Option key={name} label={name} className={optionStyles}>
                  <span>{name}</span>
                  <Select.OptionIndicator className={optionIndicatorStyles}>
                    <CheckIcon />
                  </Select.OptionIndicator>
                </Select.Option>
              ))}
            </Select.Options>
          </Select.Root>
          <button type="submit">Submit</button>
        </form>
        <div>Result: {JSON.stringify(selected)}</div>
      </div>
    );
  },
};

const colorsGroups = {
  'Warm Colors': ['Red', 'Orange', 'Yellow'],
  'Cool Colors': ['Green', 'Blue', 'Purple'],
  'Neutral Colors': ['Black', 'White', 'Gray'],
};

export const Groups: Story = {
  render: () => {
    return (
      <Select.Root placement={'bottom'} sideOffset={8} required>
        <Select.Trigger className={triggerStyles}>
          <Select.Value placeholder={'Select a Color'} />
          <span className={openIconStyles}>
            <OpenIcon />
          </span>
        </Select.Trigger>
        <Select.Options className={optionsStyles}>
          {Object.entries(colorsGroups).map(([group, options]) => {
            return (
              <Select.OptionsGroup key={group}>
                <Select.OptionsGroupLabel className={selectLabelStyles}>
                  {group}
                </Select.OptionsGroupLabel>
                {options.map((name) => (
                  <Select.Option
                    key={name}
                    label={name}
                    className={optionStyles}
                  >
                    <span>{name}</span>
                    <Select.OptionIndicator className={optionIndicatorStyles}>
                      <CheckIcon />
                    </Select.OptionIndicator>
                  </Select.Option>
                ))}
              </Select.OptionsGroup>
            );
          })}
        </Select.Options>
      </Select.Root>
    );
  },
};

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="12"
    height="12"
    fill="none"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
  >
    <path d="M2 20 L12 28 30 4" />
  </svg>
);

const OpenIcon = () => (
  <svg
    height={15}
    width={15}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
  >
    <path
      d="M7 7l3-3 3 3m0 6l-3 3-3-3"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
