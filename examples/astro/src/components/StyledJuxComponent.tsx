import { css } from '@juxio/css';

export const titleStyle = css({
  color: 'violet',
  '&:hover': {
    color: 'darkviolet',
  },
});

export const MyStyledComponent = ({
  children,
  title,
}: React.PropsWithChildren & { title: string }) => {
  return (
    <div
      className={css({
        border: '1px solid {core.color.brand_200}',
        borderRadius: '{core.dimension.spacing_100}',
        padding: '1.5rem',
        flexDirection: 'column',
        gap: 'clamp(0.5rem, calc(0.125rem + 1vw), 1rem)',

        [`.${titleStyle}`]: {
          marginBottom: '1rem',
        },
      })}
    >
      <span className={titleStyle}>{title}</span>
      {children}
    </div>
  );
};
