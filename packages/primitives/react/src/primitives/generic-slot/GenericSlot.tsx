import React from 'react';
import { EmptyObject } from '../../utils/types/empty-object';

/**
 * `GenericSlot` is a utility component that implements the "slot pattern" for React components.
 * It allows components to be polymorphic - meaning they can render as different elements while
 * maintaining proper prop merging and type safety.
 *
 * The slot pattern is useful when you want to:
 * 1. Allow consumers to replace your component's root element completely
 * 2. Maintain proper prop merging between your component and the slotted element
 * 3. Keep full TypeScript type safety
 *
 * Common use cases:
 * - Building accessible UI components that need to render as different elements
 * - Creating flexible layout components
 * - Implementing compound components that need to adapt to different contexts
 *
 * @example
 * // Basic usage in a Button component
 * function Button({ asChild, ...props }) {
 *   if (asChild) {
 *     return <GenericSlot {...props} />;
 *   }
 *   return <button {...props} />;
 * }
 *
 * // Using the Button with a custom element
 * <Button asChild>
 *   <a href="/contact">Contact</a>
 * </Button>
 *
 * @example
 * // With TypeScript and custom props
 * type ButtonProps = PolymorphicComponentProp<
 *   'button',
 *   {
 *     variant?: 'primary' | 'secondary';
 *   }
 * >;
 *
 * const Button = ({ asChild, variant, ...props }: ButtonProps) => {
 *   if (asChild) {
 *     return <GenericSlot {...props} data-variant={variant} />;
 *   }
 *   return <button {...props} data-variant={variant} />;
 * };
 */

/**
 * The element to render. Must be a single React element.
 * This element will receive all props passed to GenericSlot.
 */
type GenericSlotProps<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>;

export const GenericSlot = React.forwardRef(function GenericSlot<
  T extends React.ElementType,
>({ children, ...props }: GenericSlotProps<T>, ref?: React.Ref<HTMLElement>) {
  return React.cloneElement(children, {
    ...props,
    ref,
    ...children.props, // Child props take precedence over parent props
  });
});

/**
 * Type helper for creating polymorphic components that use the slot pattern.
 *
 * @template T - The default HTML element type (e.g., 'button', 'div')
 * @template Props - Additional props specific to your component
 *
 * @example
 * type ButtonProps = PolymorphicComponentProp<
 *   'button',
 *   {
 *     variant?: 'primary' | 'secondary';
 *   }
 * >;
 */
export type PolymorphicComponentProp<
  T extends React.ElementType,
  Props = EmptyObject,
> = {
  /**
   * When true, the component will render its child element instead of its default element,
   * while properly merging props.
   */
  asChild?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof Props> &
  Props;
