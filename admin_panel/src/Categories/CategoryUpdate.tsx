import classes from "../Classes.module.css";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";


const SearchUpdate = () => {

  const categoriesStore = useCategoriesStore(state => state)

  const onAddSearch = () => {
    if (categoriesStore.isSearchAdd !== categoriesStore.category!.id) {
      categoriesStore.setSearchAdd({name: "", categoryId: categoriesStore.category!.id, subCategoryId: -1})
      categoriesStore.setIsSearchAdd(categoriesStore.category!.id)
    } else {
      categoriesStore.setIsSearchAdd(-1)
    }
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Редактирование категории</div>
      {categoriesStore.category ?
        <div className={classes.menuContainer}>
          <div className={classes.name}>ID: {categoriesStore.category.id}</div>
          <div className={classes.name}>
            Название категории
            <input
              className={classes.input}
              type="text"
              value={categoriesStore.category.name}
              onInput={(e) => categoriesStore.setCategory({...categoriesStore.category!, name: e.currentTarget.value})}
            />
          </div>
          <div className={classes.name}>
            Навигация
            {categoriesStore.category.searches.length > 0 ? <hr className={classes.hr}/> : <> отсутствует</>}
            {categoriesStore.category.searches.map((search, index) => (<>
              <div
                className={classes.name}
                key={index}
                style={categoriesStore.search?.id === search.id ? {color: "#1b9f01"} : {cursor: "pointer"}}
                onClick={() => categoriesStore.setSearch(search)}
              >
                {search.name}

              </div>
              <hr className={classes.hr}/>
            </>))}
          </div>
          <div
            className={classes.button}
            onClick={() => onAddSearch()}
            style={categoriesStore.isSearchAdd === categoriesStore.category.id ? {background: "#56585F", color: "#EEEFF9"} : {cursor: "pointer"}}
          >
            {categoriesStore.isSearchAdd !== categoriesStore.category.id ? "Добавить новую навигацию" : "Выйти из режима создания"}
          </div>
          <div className={classes.name}>
            Дата создания: {categoriesStore.category.created}
          </div>
          <div className={classes.name}>
            Дата изменения: {categoriesStore.category.updated}
          </div>
        </div> :
        <div>Выберите категорию из списка</div>
      }
    </div>

  )
}

export default SearchUpdate