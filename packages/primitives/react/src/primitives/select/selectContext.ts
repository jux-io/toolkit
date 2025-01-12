import * as React from 'react';
import { useFloating, useInteractions } from '@floating-ui/react';
import { createCustomContext } from '../../utils/createCustomContext';
import { Direction, SelectValue } from './types';
import { OPTION_NAME, SelectOptionContextValue } from './Option';

export const SELECT_NAME = 'Jux.Select';

const { Provider: SelectProvider, useContext: useSelectContext } =
  createCustomContext<SelectContextValue<unknown>>(SELECT_NAME);

const { Provider: SelectOptionProvider, useContext: useSelectOptionContext } =
  createCustomContext<SelectOptionContextValue>(OPTION_NAME);

export interface SelectContextValue<T = unknown> {
  contentId: string;
  value: SelectValue<T>;
  open: boolean;
  setOpen: (open: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  direction?: Direction;
  multiple?: boolean;
  handleSelect: (index: number) => void;
  activeIndex: number | null;
  selectedIndex: number | null;
  getOptionValue: (index: number) => T;
  selectedValueOptionElementsMap: React.MutableRefObject<
    Map<string, HTMLElement>
  >;
  optionListElementsMap: React.MutableRefObject<Map<string, HTMLElement>>;
  popperContext: {
    isTyping: boolean;
    interactions: ReturnType<typeof useInteractions>;
    floatingContext: ReturnType<typeof useFloating>;
    elementsRef: React.MutableRefObject<(HTMLElement | null)[]>;
    labelsRef: React.MutableRefObject<string[]>;
    valuesRef: React.MutableRefObject<T[]>;
  };
}

export {
  SelectProvider,
  useSelectContext,
  SelectOptionProvider,
  useSelectOptionContext,
};
