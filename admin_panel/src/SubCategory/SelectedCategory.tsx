import classes from "../Classes.module.css";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";


const SelectedCategory = () => {

  const categoriesStore = useCategoriesStore(state => state)

  const onAddSubcategory = () => {
    if (categoriesStore.isSubCategoryAdd === -1) {
      categoriesStore.setIsSubCategoryAdd(categoriesStore.category!.id)
    } else {
      categoriesStore.setIsSubCategoryAdd(-1)
    }
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Выбранная категории</div>
      {categoriesStore.category ?
        <div className={classes.menuContainer}>
          <div className={classes.name}>ID: {categoriesStore.category.id}</div>
          <div className={classes.name}>
            Название категории: {categoriesStore.category.name}
          </div>
          <div className={classes.menuContainer}>
            Список подкатегорий
            {categoriesStore.category.subCategories.length > 0 ? <hr className={classes.hr}/> : <> пуст</>}
            {categoriesStore.category.subCategories.map((subCategory) => (
              <div className={classes.name}>
                <div
                  className={classes.name}
                  key={'subcategory#' + subCategory.id}
                  style={categoriesStore.subCategory?.id === subCategory.id ? {color: "#1b9f01"} : {cursor: "pointer"}}
                  onClick={() => categoriesStore.setSubCategory(subCategory)}
                >
                  {subCategory.name}
                </div>
                <hr className={classes.hr}/>
            </div>))}
          </div>
          <div
            className={classes.button}
            onClick={() => onAddSubcategory()}
            style={categoriesStore.isSubCategoryAdd === -1 ? {background: "#EEEFF9", color: "#56585F"} : {background: "#56585F", color: "#EEEFF9"}}
          >
            {categoriesStore.isSubCategoryAdd === -1 ? "Добавить новую подкатегорию" : "Выйти из режима создания"}
          </div>
        </div> :
        <div>Выберите категорию из списка</div>
      }
    </div>

  )
}

export default SelectedCategory