import { useEffect, useRef } from 'react';
import styles from './Catalog.module.css';
import { useUIStore } from "../../../stores/useUIStore.ts";
import Product from "./Product.tsx";

const ProductsList = () => {
  const uiStore = useUIStore(state => state);

  const subCategoryRefs = useRef<{ id: number; element: HTMLDivElement | null }[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const subCategory = uiStore.selectedCategory?.subCategories!.find(
            subCat => subCat.id === parseInt(entry.target.id, 10)
          );

          if (subCategory && uiStore.selectedSubCategory?.id !== subCategory.id) {
            uiStore.setCurrentSubCategory(subCategory);
          }
        }
      });
    }, {
      threshold: 0.5
    });

    subCategoryRefs.current.forEach(ref => {
      if (ref.element) {
        observer.observe(ref.element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [uiStore]);

  useEffect(() => {
    if (uiStore.selectedSubCategory) {
      const subCategoryRef = subCategoryRefs.current.find(ref => ref.id === uiStore.selectedSubCategory?.id);
      if (subCategoryRef && subCategoryRef.element) {
        subCategoryRef.element.scrollIntoView({
          behavior: 'auto',
          block: 'start'
        });
      }
    }
  }, [uiStore.selectedSubCategory]);


  useEffect(() => {

  }, [uiStore.selectedCategory])

  return (
    <main className={styles.productList}>
      {uiStore.selectedCategory?.subCategories?.map((subCategory, index) => {
        return (
          <div
            key={subCategory.id}
            id={subCategory.id.toString()} // Set the id to the subcategory id for reference
            ref={(el) => {
              subCategoryRefs.current[index] = { id: subCategory.id, element: el };
            }}
            className={styles.subCategory}
          >
            <div className={styles.subCategoryName}>
              {subCategory.name}
            </div>
            <div className={styles.subCategoryProducts}>
              {subCategory.products?.map((product) => (
                <Product product={product} key={product.id} />
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
};

export default ProductsList;
