import styles from './Catalog.module.css'
import { useDataStore } from "../../../stores/useDataStore.ts";
import CartProduct from "./CartProduct.tsx";

const CartList = () => {

  const dataStore = useDataStore(state => state);

  return (
    <div
      className={styles.cartList}
    >
      {
        dataStore.cart.map((product, index) => {
          return (
            <div
              key={index}
            >
              <CartProduct product={product} />
              {index < dataStore.cart.length - 1 && <hr className={styles.cartProductLine} key={index}/>}
            </div>
          )
        })
      }
      {dataStore.cart.length === 0 &&
        <div
          className={styles.cartListEmpty}
        >
          Корзина пуста
        </div>
      }
    </div>
  )
}

export default CartList