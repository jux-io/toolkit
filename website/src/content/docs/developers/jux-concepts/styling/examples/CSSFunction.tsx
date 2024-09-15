import { css } from '@juxio/css';

const styles = css({
  color: 'violet',
  border: '1px solid violet',
  backgroundColor: 'transparent',
  borderRadius: '8px',
  padding: '8px 16px',
  '&:hover': {
    borderColor: 'darkviolet',
  },
  '&:active': {
    outline: 'none',
    boxShadow: '0 0 0 1px darkviolet',
  },
});

export default function App() {
  return <button className={styles}>Hello from Jux 🤖</button>;
}
