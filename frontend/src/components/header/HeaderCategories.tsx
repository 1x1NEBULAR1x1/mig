import styles from "./Header.module.css";
import { useUIStore } from "../../../stores/useUIStore";
import {useDataStore} from "../../../stores/useDataStore.ts";

const HeaderCategories = () => {
  const dataStore = useDataStore((state) => state);
  const uiStore = useUIStore((state) => state);

  return (
    <div
      className={styles.categories}
    >
      {dataStore.categories?.map((category) => {
        if (uiStore.selectedCategory && uiStore.selectedCategory.id === category.id) {
          return (
            <p
              key={category.id}
              className={styles.selectedCategory}
            >
              {category.name}
            </p>
          );
        }
        return (
          <p
            key={category.id}
            className={styles.category}
            onClick={() => uiStore.setSelectedCategory(category)}
          >
            {category.name}
          </p>
        );
      })}
    </div>
  )
}

export default HeaderCategories