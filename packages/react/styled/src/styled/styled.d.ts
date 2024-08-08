import type {
  BaseProps,
  CSSProperties,
  CSSPropertiesWithCustomValues,
  MergeWithOverrides,
} from './base';

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
    NonNullable<unknown>,
    NonNullable<unknown>
  >;
  variants?: StyledVariants<
    Props,
    NonNullable<unknown>,
    NonNullable<unknown>
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
