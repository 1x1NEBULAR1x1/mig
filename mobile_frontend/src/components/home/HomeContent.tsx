import CategoriesList from "./CategoriesList.tsx";
import styles from './Home.module.css'

const HomeContent = () => {

  return (
    <div
      className={styles.content}
    >
      <CategoriesList />
    </div>
  );
}

export default HomeContent