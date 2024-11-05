import styles from './page.module.css';
import { MyStyledComponent } from './components/my-component';
import { Button as MyButton } from '@/jux/components/Button';
import { RegularModal } from '@/jux/components/RegularModal';

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
      <section>
        <RegularModal body={<p>Modal body! isnt that cool?</p>} />
      </section>
    </div>
  );
}
