import React from 'react';
import { calculateHash } from '@juxio/css';
import clsx from './utils/clsx';

function getVariantClasses(props, variants) {
  return variants.filter(({ props: variantProps }) =>
    typeof variantProps === 'function'
      ? variantProps(props)
      : Object.entries(variantProps).every(
          ([propKey, propValue]) => props[propKey] === propValue
        )
  );
}

export const getDisplayName = (Component) => {
  if (typeof Component === 'string') return Component;
  return Component?.displayName || Component?.name || 'Component';
};

const styled = (tag, styles, options = {}) => {
  const baseClassName = `jux-${calculateHash(JSON.stringify(styles.root)).slice(0, 6)}`;

  const { shouldForwardProp = () => true } = options;

  const StyledComponent = React.forwardRef(
    function StyledComponent(props, ref) {
      const { className, style, ...restProps } = props;

      // Represents the current variants we should apply
      const matchedVariants = getVariantClasses(props, styles.variants ?? []);

      const finalClassName = clsx(
        className,
        baseClassName,
        ...matchedVariants.map(
          (v) => `jux-${calculateHash(JSON.stringify(v.style)).slice(0, 6)}`
        )
      );

      const newProps = {};

      for (const key in restProps) {
        if (shouldForwardProp(key)) {
          newProps[key] = restProps[key];
        }
      }

      return React.createElement(tag, {
        ref,
        className: finalClassName,
        style,
        ...newProps,
      });
    }
  );

  StyledComponent.toString = () => `.${baseClassName}`;

  return StyledComponent;
};

export default styled;
