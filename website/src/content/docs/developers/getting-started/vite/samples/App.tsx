import { css } from '@juxio/css';

function App() {
  return (
    <div
      className={css({
        color: 'violet',
        fontSize: '2rem',
        '&:hover': {
          color: 'darkviolet',
        },
      })}
    >
      Hello from Jux in Vite! 🚀
    </div>
  );
}

export default App;
