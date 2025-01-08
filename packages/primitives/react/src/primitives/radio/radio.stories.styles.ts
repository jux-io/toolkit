import { css } from '@juxio/react-styled';

export const RadioButtonStyles = css({
  appearance: 'none',
  backgroundColor: 'transparent',
  margin: 0,
  width: '20px',
  height: '20px',
  border: '2px solid var(--color-gray-400, #a3a3a3)',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  position: 'relative',
  padding: 0,
  transition: 'all 150ms ease-in-out',
  color: 'var(--color-gray-400, #a3a3a3)',

  '&:not(:disabled):not([data-disabled]):hover': {
    borderColor: 'var(--color-primary, #0066ff)',
    color: 'var(--color-primary, #0066ff)',
  },

  '&::before': {
    content: '""',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transform: 'scale(0)',
    transition: 'transform 150ms ease-in-out',
    backgroundColor: 'currentColor',
  },

  '&[data-state="checked"]': {
    borderColor: 'var(--color-primary, #0066ff)',
    color: 'var(--color-primary, #0066ff)',
  },

  '&[data-state="checked"]::before': {
    transform: 'scale(1)',
  },

  '&[data-state="indeterminate"]': {
    borderColor: 'var(--color-warning, #f59e0b)',
    color: 'var(--color-warning, #f59e0b)',
    backgroundColor: 'var(--color-warning-50, #fef3c7)',
  },

  '&[data-state="indeterminate"]::before': {
    content: '""',
    width: '10px',
    height: '2px',
    borderRadius: '1px',
    backgroundColor: 'currentColor',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-1px',
    marginLeft: '-5px',
  },

  '&[data-state="indeterminate"]::after': {
    content: '""',
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '1px',
    backgroundColor: 'currentColor',
    opacity: 0.3,
    transform: 'rotate(45deg)',
  },

  '&:disabled, &[data-disabled]': {
    cursor: 'not-allowed',
    borderColor: 'var(--color-gray-300, #d1d5db)',
    color: 'var(--color-gray-300, #d1d5db)',
    backgroundColor: 'var(--color-gray-50, #f9fafb)',
  },

  '&:focus-visible:not(:disabled):not([data-disabled])': {
    outline: '2px solid var(--color-primary, #0066ff)',
    outlineOffset: '2px',
  },
});

export const RadioWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',

  '&:not(button[data-disabled]):hover': {
    '[role="radio"]:not(:disabled):not([data-disabled])': {
      borderColor: 'var(--color-primary, #0066ff)',
      color: 'var(--color-primary, #0066ff)',
    },
  },

  '&[data-disabled]': {
    cursor: 'not-allowed',
    pointerEvents: 'none',

    '& label': {
      cursor: 'not-allowed',
      color: 'var(--color-gray-400, #a3a3a3)',
      pointerEvents: 'none',
      opacity: 0.6,
    },
  },
});

export const RadioLabelStyles = css({
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'color 150ms ease-in-out',
  color: 'var(--color-gray-700, #374151)',
  padding: '0.25rem',

  '[data-state="indeterminate"] ~ &': {
    color: 'var(--color-warning, #f59e0b)',
  },

  '[role="radio"]:disabled ~ &, [role="radio"][data-disabled] ~ &': {
    cursor: 'not-allowed',
    opacity: 0.6,
    color: 'var(--color-gray-400, #a3a3a3)',
    pointerEvents: 'none',
  },
});
