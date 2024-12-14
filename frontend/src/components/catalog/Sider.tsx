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

      </div>
      <div
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
      </div>
    </aside>
  );
}

export default Sider