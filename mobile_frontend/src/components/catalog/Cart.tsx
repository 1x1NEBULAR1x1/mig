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
        <div
          onClick={() => uiStore.setIsCartOpened(!uiStore.isCartOpened)}
          className={styles.cartButton}>
          {!uiStore.isCartOpened ?
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M7.29297 0.292894L0.292969 7.29289L1.70718 8.70711L8.00008 2.41421L14.293 8.70711L15.7072 7.29289L8.70718 0.292894C8.31666 -0.0976312 7.68349 -0.0976312 7.29297 0.292894Z"
                    fill="#1B1C1F"/>
            </svg> :
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.41433 5.89953L11.657 1.65689L10.2428 0.242679L6.00012 4.48532L1.75748 0.242676L0.343266 1.65689L4.58591 5.89953L0.343262 10.1422L1.75748 11.5564L6.00012 7.31374L10.2428 11.5564L11.657 10.1422L7.41433 5.89953Z"
                fill="#1B1C1F"/>
            </svg>
          }
        </div>
      </div>
      {
        <div
          style={!uiStore.isCartOpened ? {display: 'none'} : {}}
          className={styles.cartBody}
        >
          <CartList/>

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
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth' // Makes the scrolling smooth
                });
              }}
						>
							Перейти в корзину
						</div>
					</div>
        }
        </div>}
    </div>
  );
}

export default Cart