import { styled } from '@juxio/react-styled';

const Button = styled('button', {
  root: {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '8px 16px',
    border: '1px solid',
  },
  variants: [
    {
      props: { type: 'primary' },
      style: {
        color: 'violet',
      },
    },
  ],
});

const DangerButton = styled(Button, {
  root: {},
  variants: [
    {
      props: { type: 'danger' },
      style: { color: '#d13333' },
    },
  ],
});

export default function App() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button type={'primary'}>I'm primary</Button>
      <DangerButton type={'danger'}>I'm danger</DangerButton>
      <DangerButton type={'primary'}>I'm danger but primary</DangerButton>
    </div>
  );
}
