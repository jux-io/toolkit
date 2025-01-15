import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as Select from './index';
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
  argTypes: {
    placement: {
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      control: { type: 'select' },
    },
    sideOffset: {
      control: { type: 'number' },
    },
    alignOffset: {
      control: { type: 'number' },
    },
    open: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    required: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select.Root>;

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

interface Country {
  name: string;
  value: string;
  emoji: string;
}

const countries: Country[] = [
  { name: 'United States', value: 'US', emoji: '🇺🇸' },
  { name: 'Canada', value: 'CA', emoji: '🇨🇦' },
  { name: 'United Kingdom', value: 'UK', emoji: '🇬🇧' },
  { name: 'Australia', value: 'AU', emoji: '🇦🇺' },
];

export const Basic: Story = {
  render: (args) => {
    return (
      <>
        <Select.Root {...args}>
          <Select.Trigger className={triggerStyles}>
            <Select.Value placeholder={'Select a Color'} />
            <span className={openIconStyles}>
              <OpenIcon />
            </span>
          </Select.Trigger>
          <Select.Options className={optionsStyles}>
            {colors.map((name) => (
              <Select.Option
                key={name}
                value={name}
                label={name}
                className={optionStyles}
              >
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

export const PartialTrigger: Story = {
  render: () => {
    return (
      <>
        <Select.Root<string>
          className={triggerStyles}
          placement={'bottom'}
          sideOffset={8}
        >
          <div>&#128512;</div>
          <Select.Trigger
            className={css({
              display: 'contents',
            })}
          >
            <Select.Value placeholder={'Select a Color'} />
          </Select.Trigger>
          <span className={openIconStyles}>
            <OpenIcon />
          </span>
          <Select.Options className={optionsStyles}>
            {colors.map((name) => (
              <Select.Option
                key={name}
                value={name}
                label={name}
                className={optionStyles}
              >
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
        <Select.Root<string>
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
              <Select.Option
                key={name}
                value={name}
                label={name}
                className={optionStyles}
              >
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
    const [selected, setSelected] = React.useState<Record<string, string[]>>(
      {}
    );

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
                <Select.Option
                  key={name}
                  label={name}
                  value={name}
                  className={optionStyles}
                >
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
      <Select.Root<string> placement={'bottom'} sideOffset={8} required>
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
                    value={name}
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

export const CountrySelect: Story = {
  render: () => {
    interface Country {
      name: string;
      value: string;
      emoji: string;
    }

    const countries: Country[] = [
      { name: 'United States', value: 'US', emoji: '🇺🇸' },
      { name: 'Canada', value: 'CA', emoji: '🇨🇦' },
      { name: 'United Kingdom', value: 'UK', emoji: '🇬🇧' },
      { name: 'Australia', value: 'AU', emoji: '🇦🇺' },
    ];

    return (
      <Select.Root placement={'bottom'} sideOffset={8} required>
        <Select.Trigger className={triggerStyles}>
          <Select.Value<Country> placeholder={'Select a country'}>
            {(value) => (
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{value.emoji}</span>
                <span>{value.name}</span>
              </span>
            )}
          </Select.Value>
          <span className={openIconStyles}>
            <OpenIcon />
          </span>
        </Select.Trigger>
        <Select.Options className={optionsStyles}>
          {countries.map((country) => (
            <Select.Option
              key={country.value}
              value={country}
              label={country.name}
              className={optionStyles}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{country.emoji}</span>
                <span>{country.name}</span>
                <Select.OptionIndicator className={optionIndicatorStyles}>
                  <CheckIcon />
                </Select.OptionIndicator>
              </span>
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    );
  },
};

export const CustomValue: Story = {
  render: () => {
    return (
      <Select.Root placement={'bottom'} sideOffset={8}>
        <Select.Trigger className={triggerStyles}>
          <Select.Value<Country>
            placeholder={'Select a country'}
            className={css({
              display: 'flex',
            })}
          >
            {(value) => (
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{value.name}</span>
                <span>{value.emoji}</span>
              </span>
            )}
          </Select.Value>
          <span className={openIconStyles}>
            <OpenIcon />
          </span>
        </Select.Trigger>
        <Select.Options className={optionsStyles}>
          {countries.map((country) => (
            <Select.Option
              key={country.value}
              value={country}
              label={country.name}
              className={optionStyles}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{country.emoji}</span>
                <span>{country.name}</span>
                <Select.OptionIndicator className={optionIndicatorStyles}>
                  <CheckIcon />
                </Select.OptionIndicator>
              </span>
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    );
  },
};

export const CustomValueMultipleInsideForm: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Record<string, Country[]>>(
      {}
    );

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
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const values = formData.getAll('country').map((value) => {
              try {
                const country = JSON.parse(value as string) as Country;
                return country;
              } catch {
                return value;
              }
            });
            setSelected({
              color: values as Country[],
            });
          }}
        >
          <Select.Root<Country>
            placement={'bottom'}
            sideOffset={8}
            name={'country'}
            closeOnSelect={false}
            required
            multiple
          >
            <Select.Trigger className={triggerStyles}>
              <Select.Value<Country>
                placeholder={'Select multiple countries'}
                className={`${multipleValuesStyles} ${css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                })}`}
              >
                {(value) => (
                  <span
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      '&:after': {
                        content: '", "',
                      },
                      '&:last-child:after': {
                        content: '""',
                      },
                    })}
                  >
                    <span>{value.emoji}</span>
                    <span>{value.name}</span>
                  </span>
                )}
              </Select.Value>
              <span className={openIconStyles}>
                <OpenIcon />
              </span>
            </Select.Trigger>
            <Select.Options className={optionsStyles}>
              {countries.map((country) => (
                <Select.Option
                  key={country.value}
                  label={country.name}
                  value={country}
                  className={optionStyles}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{country.name}</span>
                    <span>{country.emoji}</span>
                    <Select.OptionIndicator className={optionIndicatorStyles}>
                      <CheckIcon />
                    </Select.OptionIndicator>
                  </span>
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

export const NoValue: Story = {
  render: () => {
    return (
      <Select.Root placement={'bottom'} sideOffset={8}>
        <Select.Trigger className={triggerStyles}>
          <Select.Value placeholder={'Select a country'} />
          <span className={openIconStyles}>
            <OpenIcon />
          </span>
        </Select.Trigger>
        <Select.Options className={optionsStyles}>
          {countries.map((country) => (
            <Select.Option
              key={country.value}
              value={country}
              className={optionStyles}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{country.emoji}</span>
                <span>{country.name}</span>
                <Select.OptionIndicator className={optionIndicatorStyles}>
                  <CheckIcon />
                </Select.OptionIndicator>
              </span>
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    );
  },
};

const CountryOption = ({ country }: { country: Country }) => {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>{country.emoji}</span>
      <span>{country.name}</span>
    </span>
  );
};

export const NoValueMultiple: Story = {
  render: () => {
    return (
      <Select.Root placement={'bottom'} sideOffset={8} multiple>
        <Select.Trigger className={triggerStyles}>
          <Select.Value<Country>
            placeholder={'Select a country'}
            className={css({ display: 'flex', gap: '8px', overflow: 'hidden' })}
          >
            {(value) => <CountryOption country={value} />}
          </Select.Value>
          <span className={openIconStyles}>
            <OpenIcon />
          </span>
        </Select.Trigger>
        <Select.Options className={optionsStyles}>
          {countries.map((country) => (
            <Select.Option
              key={country.value}
              value={country}
              label={country.name}
              className={optionStyles}
            >
              <CountryOption country={country} />
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    );
  },
};

export const WithPreSelectedValue: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Country | null>(
      countries[0]
    );
    return (
      <Select.Root placement={'bottom'} value={selected} onChange={setSelected}>
        <Select.Trigger className={triggerStyles}>
          <Select.Value placeholder={'Select a country'} />
          <span className={openIconStyles}>
            <OpenIcon />
          </span>
        </Select.Trigger>
        <Select.Options className={optionsStyles}>
          {countries.map((country) => (
            <Select.Option
              key={country.value}
              value={country}
              label={country.name}
              className={optionStyles}
            >
              <CountryOption country={country} />
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    );
  },
};

export const CompleteControl: Story = {
  render: () => {
    const [selectedCountry, setSelectedCountry] =
      React.useState<Country | null>(null);
    const [open, setOpen] = React.useState(false);
    return (
      <Select.Root
        placement={'bottom'}
        value={selectedCountry}
        onChange={setSelectedCountry}
        open={open}
        onOpenChange={setOpen}
      >
        <Select.Trigger className={triggerStyles}>
          <Select.Value placeholder={'Select a country'} />
          <span className={openIconStyles}>
            <OpenIcon />
          </span>
        </Select.Trigger>
        <Select.Options className={optionsStyles} open={open}>
          {countries.map((country) => (
            <Select.Option
              selected={selectedCountry?.value === country.value}
              key={country.value}
              value={country}
              label={country.name}
              className={optionStyles}
            >
              <CountryOption country={country} />
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    );
  },
};
