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
      {uiStore.selectedCategory?.subCategories?.length ? uiStore.selectedCategory?.subCategories.map((subCategory, index) => {
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
      }) : <div className={styles.productList}>
        <div className={styles.subCategoryName} style={{color: 'black', flexDirection: 'column', marginBottom: '2vh'}}>
          В данной категории нет продуктов
            <div
              className={styles.backLink}
              style={{fontSize: '2vh'}}
              onClick={() => uiStore.setSelectedCategory(undefined)}
            >
              <svg width="0.9375vw" height="1.166667vh" viewBox="0 0 18 14" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.57751 6.16632L8.45554 1.52369L7.30652 0.316406L0.924838 6.39014C0.580006 6.71833 0.579701 7.2682 0.924168 7.59678L7.30585 13.684L8.45622 12.478L3.5865 7.83299L17.3326 7.83387L17.3327 6.1672L10.4551 6.16676L3.57751 6.16632Z"
                  fill="#1B9F01"/>
              </svg>
              Вернуться назад
            </div>
        </div>
      </div>}
    </main>
  );
};

export default ProductsList;
