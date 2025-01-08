import { createCustomContext } from '../../utils/createCustomContext';
import { Direction, Orientation } from './types';

export const TABS_NAME = 'Jux.Tabs';

export interface TabsContextValue {
  baseId: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation: Orientation;
  direction?: Direction;
  activationMode?: 'automatic' | 'manual';
}

export const { Provider: TabsProvider, useContext: useTabsContext } =
  createCustomContext<TabsContextValue>(TABS_NAME);
