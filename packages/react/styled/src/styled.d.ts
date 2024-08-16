import {
  BaseProps,
  CSSProperties,
  CSSPropertiesWithCustomValues,
  CustomTokensValues,
  CustomTypes,
  MergeWithOverrides,
} from './base';
import { Tokens } from './tokens';
import React from 'react';

export interface StyledVariants<
  Props extends BaseProps,
  CustomTokensValues extends CSSProperties = object,
  CustomTypes = object,
> {
  props: Partial<Props> | ((props: Props) => boolean);
  style: CSSPropertiesWithCustomValues<Props, CustomTokensValues, CustomTypes>;
}

export interface StylesDefinition<Props extends BaseProps> {
  root: CSSPropertiesWithCustomValues<
    Props,
    CustomTokensValues<Tokens>,
    CustomTypes<Tokens>
  >;
  variants?: StyledVariants<
    Props,
    CustomTokensValues<Tokens>,
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
  Props extends BaseProps = NonNullable<unknown>,
>(
  component: Component,
  styles: StylesDefinition<Props>,
  options?: CreateStyledOptions
) => StyledComponent<
  MergeWithOverrides<React.ComponentPropsWithRef<Component>, Props>
>;

declare const styled: CreateStyled;

export default styled;
