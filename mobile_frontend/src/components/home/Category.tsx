import styles from './Home.module.css';
import {type Category, SubCategory} from "../../../types/models";
import { useUIStore } from "../../../stores/useUIStore.ts";
import {url} from "../../../requests/load_data.ts";

const Category = ({ category }: { category: Category }) => {
  const uiStore = useUIStore((state) => state);

  return (
    <div
      className={styles.category}
      onClick={() => {
        uiStore.setSelectedCategory(category);
         window.scrollTo({
           top: 0,
           behavior: 'smooth' // Makes the scrolling smooth
         });
      }}
    >
      <div className={styles.categoryText}>
        <div className={styles.categoryName}>
          {category.name || ''}
        </div>
        <div className={styles.categorySubcategories}>
          {category.searches?.map((search) => {
            let subCategory: SubCategory | undefined
            if (category.subCategories) {
              subCategory = category.subCategories.find(
                  (subCategory) => subCategory.id === search.subCategoryId
              );
            }

            return (
              <div
                onClick={() => {
                  if (subCategory) {
                    uiStore.setCurrentSubCategory(subCategory);
                    uiStore.setSelectedCategory(category);
                  }
                }}
                key={search.subCategoryId}
              >
                <div className={styles.categorySubcategory}>
                  {search.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.categoryLinkAndImageContainer}>
        <a href="/" className={styles.categoryLink}>
          Перейти в раздел
        </a>
        <div className={styles.categoryImage}>
          <img src={url + category.imagePath} alt={category.name} />
        </div>
      </div>
    </div>
  );
};

export default Category;
