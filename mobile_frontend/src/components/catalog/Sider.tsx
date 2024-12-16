import styles from './Catalog.module.css'
import {useUIStore} from "../../../stores/useUIStore.ts";
import {url} from "../../../requests/load_data.ts";

const Sider = () => {

  const category = useUIStore(state => state.selectedCategory)

  const uiStore = useUIStore(state => state);

  return (
    <aside
      className={styles.sider}
    >
      <div
        className={styles.header}
      >
        <div className={styles.header1}>
          <div
            className={styles.path}
          >
            {"Главная / " + category?.name}
          </div>
          <div
            className={styles.categoryName}
          >
            {category?.name}
          </div>

        </div>
        <div className={styles.header2}>
          <div
            className={styles.backLink}
            onClick={() => uiStore.setSelectedCategory(undefined)}
          >
            <svg width="0.9375vw" height="1.166667vh" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.57751 6.16632L8.45554 1.52369L7.30652 0.316406L0.924838 6.39014C0.580006 6.71833 0.579701 7.2682 0.924168 7.59678L7.30585 13.684L8.45622 12.478L3.5865 7.83299L17.3326 7.83387L17.3327 6.1672L10.4551 6.16676L3.57751 6.16632Z"
                fill="#1B9F01"/>
            </svg>
            Вернуться назад
          </div>
          <div
            onClick={() => uiStore.setIsSubCategoriesSiderOpened(!uiStore.isSubCategoriesSiderOpened)}
            className={styles.headerButton}>
            {uiStore.isSubCategoriesSiderOpened ?
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.41433 5.89953L11.657 1.65689L10.2428 0.242679L6.00012 4.48532L1.75748 0.242676L0.343266 1.65689L4.58591 5.89953L0.343262 10.1422L1.75748 11.5564L6.00012 7.31374L10.2428 11.5564L11.657 10.1422L7.41433 5.89953Z"
                  fill="#1B1C1F"/>
              </svg> :
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M7.29297 8.41421L0.292969 1.41421L1.70718 0L8.00008 6.29289L14.293 0L15.7072 1.41421L8.70718 8.41421C8.31666 8.80474 7.68349 8.80474 7.29297 8.41421Z"
                      fill="#1B1C1F"/>
              </svg>
            }

          </div>
        </div>
      </div>
      {<div
        style={uiStore.isSubCategoriesSiderOpened ? {} : {display: "none"}}
        className={styles.siderSubCategoryContainer}
      >
        {category?.subCategories?.map((subCategory) => (
          <div
            style={subCategory === uiStore.currentSubCategory ? {backgroundColor: "#EEEFF3"} : {}}
            className={styles.subcategory}
            key={subCategory.id}
            onClick={() => uiStore.setSelectedSubCategory(subCategory)}
          >
            <img
              className={styles.subcategoryImage}
              src={url + (subCategory.imagePath || "/static/image_not_found.png")}
              alt={subCategory.name}
            />
            {subCategory.name}
          </div>
        ))}
      </div>}
    </aside>
  );
}

export default Sider