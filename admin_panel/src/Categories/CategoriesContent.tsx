import classes from '../Classes.module.css'
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {useEffect} from "react";
import {getCategories} from "../requests/categories.ts";
import CategoriesList from "./CategoriesList.tsx";
import CategoryUpdate from "./CategoryUpdate.tsx";
import SearchCreate from "./SearchCreate.tsx";
import SearchUpdate from "./SearchUpdate.tsx";

const CategoriesContent = () => {

  const categoriesStore = useCategoriesStore(state => state)

  useEffect(() => {
    const loadCategories = async () => {
      const categories = await getCategories()
      categoriesStore.setCategories(categories)
    }
    loadCategories().then()
  }, []);

  return (
    <div
      className={classes.content}
    >
      <CategoriesList />
      <CategoryUpdate />
      {categoriesStore.isSearchAdd >= 0 && <SearchCreate />}
      {categoriesStore.search && <SearchUpdate />}
    </div>
  )
}

export default CategoriesContent