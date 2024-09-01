import { css } from '@juxio/react-styled';

export const frameworkGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, auto)',
  gap: '2rem',
  '@media (max-width: 576px)': {
    gridTemplateColumns: 'repeat(2, auto)',
  },
});
