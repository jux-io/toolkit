import { css, styled } from '@juxio/react-styled';

const titleStyles = css({
  color: 'violet',
  '&:hover': {
    color: 'darkviolet',
  },
});

const StyledDiv = styled('div', {
  root: {
    border: '1px solid {color.core.brand_100}',
    borderRadius: '{core.dimension.spacing_100}',
    padding: '1.5rem',
    flexDirection: 'column',
    gap: 'clamp(0.5rem, calc(0.125rem + 1vw), 1rem)',

    [`.${titleStyles}`]: {
      marginBottom: '1rem',
    },
  },
  variants: [
    {
      props: { size: 'small' },
      style: {
        fontSize: '14px',
        padding: '4px 8px',
      },
    },
    {
      props: { size: 'medium' },
      style: {
        fontSize: '16px',
        padding: '8px 16px',
      },
    },
  ],
});

export const MyStyledComponent = ({
  children,
  title,
  size,
}: React.PropsWithChildren & { title: string; size: 'small' | 'medium' }) => {
  return (
    <StyledDiv size={size}>
      <span
        className={css({
          color: 'violet',
          '&:hover': {
            color: 'darkviolet',
          },
        })}
      >
        {title}
      </span>
      {children}
    </StyledDiv>
  );
};
