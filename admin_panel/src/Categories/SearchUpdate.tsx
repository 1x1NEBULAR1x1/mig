import classes from "../Classes.module.css";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {updateSearch, getCategories, deleteSearch} from "../requests/categories.ts";

const SearchUpdate = () => {

  const categoriesStore = useCategoriesStore(state => state)

  const onUpdate = async () => {
    const category = await updateSearch(categoriesStore.search!)
    if (category !== undefined) {
      categoriesStore.setIsUpdateSuccess(true)
      const categories = await getCategories()
      categoriesStore.setCategories(categories)
      categoriesStore.updateCategory(category)
    }
  }

  const onDelete = async () => {
    const category = await deleteSearch(categoriesStore.search!.id)
    if (category !== undefined) {
      categoriesStore.setSearch(undefined)
      const categories = await getCategories()
      categoriesStore.setCategories(categories)
      categoriesStore.updateCategory(category)
    }
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Редактирование навигации</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>Категория: {categoriesStore.category?.name}</div>
        <div className={classes.name}>
          Название навигации
          <input
            className={classes.input}
            type="text"
            value={categoriesStore.search?.name}
            onInput={(e) => categoriesStore.setSearch({...categoriesStore.search!, name: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Ссылка на подкатегорию<br />
          <select
            className={classes.select}
            onChange={(e) => {categoriesStore.setSearch({...categoriesStore.search!, subCategoryId: parseInt(e.currentTarget.value)})}}
          >
            {categoriesStore.category!.subCategories.map((subCategory) => (
              <option
                key={subCategory.id + subCategory.name + subCategory.imagePath}
                value={subCategory.id}
                selected={subCategory.id === categoriesStore.search?.subCategoryId}
              >
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', gap: '0.5vw'}}>
          <div
            className={classes.button}
            onClick={async () => await onUpdate()}
            style={{background: '#1b9f01', color: 'white'}}
          >
            Применить изменения
          </div>
          <div
            className={classes.button}
            onClick={async () => await onDelete()}
            style={{background: '#56585F', color: '#EEEFF9'}}
          >
            Удалить
          </div>
        </div>
        {categoriesStore.isUpdateSuccess && <div className={classes.success}>Изменения применены</div>}

        <div className={classes.name}>
          Дата создания: {categoriesStore.search?.created}
        </div>
        <div className={classes.name}>
          Дата изменения: {categoriesStore.search?.updated}
        </div>
      </div>
    </div>
  )
}

export default SearchUpdate