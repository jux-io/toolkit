import styles from './page.module.css';
import { MyStyledComponent } from './components/my-component';
import { MyButton } from '@/jux/components/MyButton';

export default function Home() {
  return (
    <div className={styles.page}>
      <MyStyledComponent title="Jux component" size="small">
        I am small!
      </MyStyledComponent>
      <MyStyledComponent title="Jux component 2" size="medium">
        Hello from component 2! I am medium.
      </MyStyledComponent>
      <section>
        <h2>Check out my imported button:</h2>
        <MyButton hierarchy="primary" disabled={false} />
      </section>
    </div>
  );
}
