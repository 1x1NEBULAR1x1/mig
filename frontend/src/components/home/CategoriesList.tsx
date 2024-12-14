import styles from './Home.module.css'
import {useDataStore} from "../../../stores/useDataStore.ts";
import Category from "./Category";

const CategoriesList = () => {

  const categories = useDataStore((state) => state.categories);

  return (
    <div
      className={styles.categoriesList}
    >
      {Array.isArray(categories) && categories.length > 0 && categories.map((category) => (
        <Category category={category} key={category.name}/>
      ))}
    </div>
  );
}

export default CategoriesList