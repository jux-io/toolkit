export enum OpenState {
  Open = 'open',
  Closed = 'closed',
}

export enum SelectState {
  Selected = 'selected',
  Idle = 'idle',
}

export type Direction = 'ltr' | 'rtl';
export type SelectValue<T = string> = T | T[];
