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
    {
      props: { type: 'danger' },
      style: {
        color: '#d13333',
      },
    },
    // Compound variant
    {
      props: { type: 'danger', disabled: true },
      style: {
        color: '#d13333',
        borderColor: '#5a1e1e',
      },
    },
  ],
});

export default function App() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button type={'primary'}>I'm primary</Button>
      <Button type={'danger'}>I'm danger</Button>
      <Button type={'danger'} disabled={true}>
        I'm danger and disabled
      </Button>
    </div>
  );
}
