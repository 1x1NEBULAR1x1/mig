import classes from '../Classes.module.css'
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {useEffect} from "react";
import {getCategories} from "../requests/categories.ts";
import CategoriesList from "../Categories/CategoriesList.tsx";
import SelectedCategory from "./SelectedCategory.tsx";
import SubCategoryUpdate from "./SubCategoryUpdate.tsx";
import SubCategoryCreate from "./SubCategoryCreate.tsx";

const SubCategoryContent = () => {

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
      <SelectedCategory />
      {categoriesStore.subCategory && <SubCategoryUpdate />}
      {categoriesStore.isSubCategoryAdd !== -1 && <SubCategoryCreate />}
    </div>
  )
}

export default SubCategoryContent