import { createCustomContext } from '../../utils/createCustomContext';

export const ACCORDION_NAME = 'Jux.Accordion';

interface AccordionContextValue {
  type: 'single' | 'multiple';
  value: string[];
  onItemOpen: (value: string) => void;
  onItemClose: (value: string) => void;
  onValueChange?: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  direction?: 'ltr' | 'rtl';
  disabled?: boolean;
  collapsible?: boolean;
}

export const { Provider: AccordionProvider, useContext: useAccordionContext } =
  createCustomContext<AccordionContextValue>(ACCORDION_NAME);
