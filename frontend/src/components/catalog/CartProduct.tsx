import styles from './Catalog.module.css'
import { useDataStore } from "../../../stores/useDataStore.ts";
import { type CartProduct } from "../../../types/models";
import {url} from "../../../requests/load_data.ts";

const CartProduct = ({ product } : {product: CartProduct}) => {

  const dataStore = useDataStore(state => state);

  return (
    <div
      className={styles.cartProduct}
    >
      <div
        className={styles.cartProductImage}
      >
        <img
          src={url + (product.product.imagePath || "/static/image_not_found.png")}
          alt={product.product.name}
        />
      </div>
      <div
        className={styles.cartProductData}
      >
        <div
          className={styles.cartProductNameContainer}
        >
          <div
            className={styles.cartProductName}
          >
            {product.product.name}
          </div>
          <div
            className={styles.cartProductRemoveButton}
            onClick={() => {
              dataStore.removeAllFromCart(dataStore.cart.find((cartItem) => cartItem?.product === product.product)!)
            }}
          >
            <svg width="0.677vw" height="1.16667vh" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.50075 8.17926L11.7448 13.4233L12.9233 12.2448L7.67926 7.00075L12.9233 1.75671L11.7448 0.578202L6.50075 5.82224L1.25664 0.578125L0.078125 1.75664L5.32224 7.00075L0.078125 12.2449L1.25664 13.4234L6.50075 8.17926Z"
                fill="#1B1C1F"/>
            </svg>
          </div>
        </div>
        <div
          className={styles.cartProductAmountAndPriceContainer}
        >
          <div
            className={styles.cartProductAmountButtons}
          >
            <div
              className={styles.cartProductAmountButton}
              onClick={() => {dataStore.updateCartProduct({...product, amount: product.amount - 1})}}
            >
              <svg width="0.625vw" height="0.16667vh" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.3327 1.66732H0.666016V0.333984H11.3327V1.66732Z" fill="#1B1C1F"/>
              </svg>
            </div>
            <div
              className={styles.cartProductAmount}
            >
              {product.amount}
            </div>
            <div
              className={styles.cartProductAmountButton}
              onClick={() => {dataStore.updateCartProduct({...product, amount: product.amount + 1})}}
            >
              <svg width="0.625vw" height="1vh" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.66667 0H5.33333V5.33333H0V6.66667H5.33333V12H6.66667V6.66667H12V5.33333H6.66667V0Z" fill="#1B1C1F"/>
              </svg>
            </div>
          </div>
          <div
            className={styles.cartProductPriceContainer}
          >
            {product.product.previousPrice &&
              <div
                className={styles.cartProductPriceSale}
              >
                {(product.product.previousPrice * product.amount).toFixed(2)} ₽
              </div>}
            <div
              className={styles.cartProductPrice}
            >
              {(product.product.price * product.amount).toFixed(2)} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartProduct