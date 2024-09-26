import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { css } from '@juxio/css';
import { MyButton } from './jux/components/MyButton';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
      <MyButton hierarchy="primary" disabled={false} />
    </>
  );
}

export default App;
