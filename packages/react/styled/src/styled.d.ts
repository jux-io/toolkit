import {
  BaseProps,
  CSSProperties,
  CSSPropertiesWithCustomValues,
  CustomTokensValues,
  CustomTypes,
  EmptyObject,
  Merge,
} from './base';
import { Tokens } from './tokens';
import * as React from 'react';

export interface StyledVariants<
  Props extends BaseProps,
  CustomTokensValues extends CSSProperties = object,
  CustomTypes = object,
> {
  props: Partial<Props> | ((props: Props) => boolean);
  style: CSSPropertiesWithCustomValues<Props, CustomTokensValues, CustomTypes>;
}

export interface StylesDefinition<
  Props extends BaseProps = NonNullable<unknown>,
> {
  root: CSSPropertiesWithCustomValues<
    Props,
    CustomTokensValues<Tokens> & CSSProperties,
    CustomTypes<Tokens>
  >;
  variants?: StyledVariants<
    Props,
    CustomTokensValues<Tokens> & CSSProperties,
    CustomTypes<Tokens>
  >[];
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
