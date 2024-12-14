import styles from './Catalog.module.css'
import CartList from "./CartList";
import { useDataStore } from "../../../stores/useDataStore";
import {useUIStore} from "../../../stores/useUIStore.ts";
import {useRecommendedProducts} from "../order/popularProducts.ts";

const Cart = () => {

  const products = useRecommendedProducts();

  const uiStore = useUIStore(state => state);

  const dataStore = useDataStore(state => state);

  const cartPrice = dataStore.cart.reduce((acc, product) => acc + product.product.price * product.amount, 0)

  return (
    <div
      className={styles.cart}
    >
      <div
        className={styles.cartHeader}
      >
        Корзина
      </div>
      <div
        className={styles.cartBody}
      >
        <CartList />
      </div>
      {dataStore.cart.length > 0 &&
        <div
          className={styles.cartFooter}
        >
          <div
            className={styles.cartValueContainer}
          >
            <div
              className={styles.cartValueLabel}
            >
              Итого
            </div>
            <div
              className={styles.cartValuePrice}
            >
              {cartPrice.toFixed(2)} ₽
            </div>
          </div>
          <div
            className={styles.cartOrderButton}
            onClick={() => {
              uiStore.setRecomendations(products);
              uiStore.setIsOrderPageOpen(true);
            }}
          >
            Перейти в корзину
          </div>
        </div>
      }
    </div>
  );
}

export default Cart