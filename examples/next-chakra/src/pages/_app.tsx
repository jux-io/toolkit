import { AppProps } from 'next/app';
import { Provider } from '../components/ui/provider';
import '../main.css';
import '../override.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
