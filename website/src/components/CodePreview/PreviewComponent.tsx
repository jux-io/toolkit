import { styled } from '@juxio/react-styled';
import * as React from 'react';

const StyledPreviewComponent = styled('div', {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    backgroundColor: 'var(--sl-color-bg)',
    borderTopLeftRadius: '{core.dimension.spacing_2}',
    borderTopRightRadius: '{core.dimension.spacing_2}',
    borderBottom: 'none',
    paddingBlock: '60px',
    border: '1px solid var(--sl-color-hairline)',
  },
});

interface PreviewComponentProps {
  children: React.ReactNode;
}

export const PreviewComponent = ({ children }: PreviewComponentProps) => {
  return <StyledPreviewComponent>{children}</StyledPreviewComponent>;
};
