import {useProductsStore} from "../stores/useProductsStore.ts";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import classes from "../Classes.module.css";

const ProductsList = () => {

  const productsStore = useProductsStore(state => state)

  const categoriesStore = useCategoriesStore(state => state)

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>
        Список продуктов
      </div>
      <div className={classes.menuContainer}>
        {categoriesStore.subCategory!.products.map((product) => (<>
          <hr className={classes.hr}/>
          <div
            className={classes.name}
            onClick={() => productsStore.setProduct(product)}
            style={productsStore.product?.id === product.id ? {color: "#1b9f01", maxWidth: '12vw'} : {cursor: "pointer", maxWidth: '12vw'}}
          >
            {product.name}
          </div>
        </>))}
        {categoriesStore.subCategory!.products.length === 0 && <div>Продукты отсутствуют</div>}
        <hr className={classes.hr}/>
        <div
          className={classes.button}
          onClick={() => {
            productsStore.setIsProductAdd(productsStore.isProductAdd === -1 ? categoriesStore.subCategory!.id : -1)}
          }
          style={productsStore.isProductAdd === -1 ? {background: "#EEEFF9", color: "#56585F"} : {background: "#56585F", color: "#EEEFF9"}}
        >
          {productsStore.isProductAdd === -1 ? "Добавить новый продукт" : "Выйти из режима создания"}
        </div>
      </div>
    </div>
  )
}

export default ProductsList