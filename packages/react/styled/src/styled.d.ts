import {
  BaseProps,
  CSSPropertiesWithCustomValues,
  EmptyObject,
  Merge,
} from '@juxio/css';
import * as React from 'react';

export interface StyledVariants<Props extends BaseProps> {
  props: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Merge<Record<string, any>, Partial<Props>> | ((props: Props) => boolean);
  style: CSSPropertiesWithCustomValues;
}

export interface StylesDefinition<
  Props extends BaseProps = NonNullable<unknown>,
> {
  root: CSSPropertiesWithCustomValues;
  variants?: StyledVariants<Props>[];
}

export interface CreateStyledOptions {
  displayName?: string;
  shouldForwardProp?: (propName: string) => boolean;
}

export type StyledComponent<Props extends BaseProps> =
  React.ForwardRefExoticComponent<Props>;

export type CreateStyled = <
  Component extends React.ElementType,
  Props extends BaseProps = EmptyObject,
>(
  component: Component,
  styles: StylesDefinition<Props>,
  options?: CreateStyledOptions
) => StyledComponent<Merge<React.ComponentPropsWithRef<Component>, Props>>;

declare const styled: CreateStyled;

export default styled;
