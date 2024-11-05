import * as React from 'react';

export const TrailingIcon = React.forwardRef<
  SVGSVGElement,
  React.HTMLAttributes<SVGSVGElement>
>(function TrailingIcon({ className, ...otherProps }, ref) {
  return (
    <svg
      width={'16'}
      height={'16'}
      viewBox={'0 0 16 16'}
      fill={'none'}
      xmlns={'http://www.w3.org/2000/svg'}
      className={className}
      ref={ref}
      {...otherProps}
    >
      <path
        fillRule={'evenodd'}
        clipRule={'evenodd'}
        d={
          'M2.66663 7.99999C2.66663 7.63181 2.9651 7.33333 3.33329 7.33333H12.6666C13.0348 7.33333 13.3333 7.63181 13.3333 7.99999C13.3333 8.36818 13.0348 8.66666 12.6666 8.66666H3.33329C2.9651 8.66666 2.66663 8.36818 2.66663 7.99999Z'
        }
        fill={'currentColor'}
      />
      <path
        fillRule={'evenodd'}
        clipRule={'evenodd'}
        d={
          'M7.52864 2.86193C7.78899 2.60158 8.2111 2.60158 8.47145 2.86193L13.1381 7.5286C13.3985 7.78895 13.3985 8.21106 13.1381 8.47141L8.47145 13.1381C8.2111 13.3984 7.78899 13.3984 7.52864 13.1381C7.26829 12.8777 7.26829 12.4556 7.52864 12.1953L11.7239 8L7.52864 3.80474C7.26829 3.54439 7.26829 3.12228 7.52864 2.86193Z'
        }
        fill={'currentColor'}
      />
    </svg>
  );
});
