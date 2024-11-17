import { describe, it, expectTypeOf } from 'vitest';
import { CSSPropertiesWithCustomValues } from '../src';

describe('jux css function', () => {
  it('Typechecking plain css object', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0,
      transition: 'opacity 0.6s ease',
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking css object with nested selectors', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      fontSize: '16px',
      color: 'violet',
      '&:hover': {
        color: 'blue',
      },
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking media queries', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      color: 'black',
      '@media (max-width: 768px)': {
        color: 'blue',
        fontSize: '14px',
      },
      '@media (prefers-color-scheme: dark)': {
        color: 'white',
        backgroundColor: '#000',
      },
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking custom properties', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      '--custom-color': '#ff0000',
      '--custom-spacing': '1rem',
      color: 'var(--custom-color)',
      padding: 'var(--custom-spacing)',
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking complex selectors', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      '& > *': { marginBottom: '1rem' },
      '& + &': { marginTop: '2rem' },
      '&:not(:last-child)': { borderBottom: '1px solid #ccc' },
      '.child-class': { color: 'blue' },
      '[data-active="true"]': { fontWeight: 'bold' },
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking animations and keyframes', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      animation: 'fadeIn 0.3s ease-in',
      '@keyframes fadeIn': {
        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        },
      },
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking pseudo-elements', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      '&::before': {
        content: '""',
        display: 'block',
        width: '100%',
        height: '2px',
      },
      '&::after': {
        content: '"→"',
        marginLeft: '0.5em',
      },
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking grid and flexbox properties', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      '& > *': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking nested media queries and selectors', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      padding: '1rem',
      '@media (min-width: 768px)': {
        padding: '2rem',
        '&:hover': {
          backgroundColor: '#f0f0f0',
          '& > span': {
            color: 'blue',
          },
        },
      },
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking CSS custom properties with fallbacks', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      color: 'var(--text-color, #000)',
      backgroundColor: 'var(--bg-color, var(--fallback-bg, #fff))',
      padding: 'var(--spacing, 1rem)',
      '--component-spacing': 'var(--global-spacing, 2rem)',
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });

  it('Typechecking CSS logical properties', () => {
    const styleObj: CSSPropertiesWithCustomValues = {
      marginInline: '1rem',
      paddingBlock: '2rem',
      inset: '0',
      borderInlineStart: '1px solid black',
      borderEndEndRadius: '4px',
    };

    expectTypeOf(styleObj).toMatchTypeOf<CSSPropertiesWithCustomValues>();
  });
});
