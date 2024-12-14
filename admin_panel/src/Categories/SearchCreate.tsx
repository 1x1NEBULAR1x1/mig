import classes from "../Classes.module.css";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {addSearch, getCategories} from "../requests/categories.ts";

const SearchCreate = () => {

  const categoriesStore = useCategoriesStore(state => state)

  const createSearch = async () => {
    if (!categoriesStore.searchAdd) return
    const category = await addSearch(categoriesStore.searchAdd)
    if (category !== undefined) {
      categoriesStore.setIsSearchAddSuccess(true)
      const categories = await getCategories()
      categoriesStore.setCategories(categories)
      categoriesStore.updateCategory(category)
    }
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Создание навигации</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>Категория: {categoriesStore.category?.name}</div>
        <div className={classes.name}>
          Название навигации
          <input
            className={classes.input}
            type="text"
            value={categoriesStore.searchAdd!.name}
            onInput={(e) => categoriesStore.setSearchAdd({...categoriesStore.searchAdd!, name: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Ссылка на подкатегорию<br />
          <select
            className={classes.select}
            onChange={(e) => {categoriesStore.setSearchAdd({...categoriesStore.searchAdd!, subCategoryId: parseInt(e.currentTarget.value)})}}
          >
            <option
              selected={true}
              onChange={() => {categoriesStore.setSearchAdd({...categoriesStore.searchAdd!, subCategoryId: -1})}}>
              Выберте подкатегорию
            </option>
            {categoriesStore.category!.subCategories.map((subCategory) => (
              <option
                key={subCategory.id + subCategory.name + subCategory.imagePath}
                value={subCategory.id}
              >
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.name}>
          <div
            className={classes.button}
            style={{background: '#1b9f01', color: 'white'}}
            onClick={async () => await createSearch()}
          >
            Добавить новую навигацию
          </div>
        </div>
        {categoriesStore.isSearchAddSuccess && <div className={classes.success}>Навигация успешно добавлена</div>}
      </div>
    </div>
  )
}

export default SearchCreate