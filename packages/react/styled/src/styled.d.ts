import {
  BaseProps,
  CSSProperties,
  CSSPropertiesWithCustomValues,
  CustomTokensValues,
  EmptyObject,
  Merge,
} from '@juxio/css';
import { Conditions, Tokens, Utilities } from '@juxio/css/types';
import * as React from 'react';

export interface StyledVariants<Props extends BaseProps> {
  props: Props | ((props: Props) => boolean);
  style: CSSPropertiesWithCustomValues<
    Merge<CSSProperties, CustomTokensValues<Tokens>>,
    Utilities,
    Conditions
  >;
  test?: Props;
}

export interface StylesDefinition<
  Props extends BaseProps = NonNullable<unknown>,
> {
  root: CSSPropertiesWithCustomValues<
    Merge<CSSProperties, CustomTokensValues<Tokens>>,
    Utilities,
    Conditions
  >;
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
