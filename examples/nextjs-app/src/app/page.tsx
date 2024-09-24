import styles from './page.module.css';
import { MyStyledComponent } from './components/my-component';

export default function Home() {
  return (
    <div className={styles.page}>
      <MyStyledComponent title="Jux component" size="small" />
      <MyStyledComponent title="Jux component 2" size="medium" />
    </div>
  );
}
