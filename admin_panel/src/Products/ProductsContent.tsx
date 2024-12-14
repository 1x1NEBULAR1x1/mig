import classes from '../Classes.module.css'
import {useProductsStore} from "../stores/useProductsStore";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {useEffect} from "react";
import CategoriesList from "../Categories/CategoriesList.tsx";
import SelectedCategoryProducts from "./SelectedCategoryProducts.tsx";
import ProductsList from "./ProductsList.tsx";
import {getCategories} from "../requests/categories.ts";
import ProductUpdate from "./ProductUpdate.tsx";
import ProductCreate from "./ProductCreate.tsx";

const CategoriesContent = () => {

  const productsStore = useProductsStore(state => state)

  const categoriesStore = useCategoriesStore(state => state)

  useEffect(() => {
    const loadCategories = async () => {
      return await getCategories()
    }
    loadCategories().then(categories => {
      console.log(categories)
      categoriesStore.setCategories(categories)
    })
  }, [])

  useEffect(() => {
    productsStore.setProduct(undefined)
  }, [categoriesStore.subCategory]);

  useEffect(() => {
    categoriesStore.setSubCategory(undefined)
  }, [categoriesStore.category]);

  return (
    <div className={classes.content}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '2vh'}}>
        <CategoriesList />
        {categoriesStore.category && <SelectedCategoryProducts/>}
      </div>
      {categoriesStore.subCategory && <ProductsList />}
      {productsStore.product! && <ProductUpdate />}
      {productsStore.isProductAdd !== -1 && <ProductCreate/>}
    </div>
  )
}

export default CategoriesContent