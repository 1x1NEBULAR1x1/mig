import styles from './Order.module.css'
import { useDataStore } from "../../../stores/useDataStore";
import { type CartProduct } from "../../../types/models.ts";
import {url} from "../../../requests/load_data.ts";

const Cart = () => {

  const dataStore = useDataStore((state) => state);

  const onDelete = (product: CartProduct) => {
    dataStore.removeAllFromCart(product)
  }

  const onInput = (value: string, product: CartProduct) => {
    if (value === '') {
      dataStore.updateCartProduct({product: product.product, amount: 0})
      return
    }
    let amount: number
    try {
      amount = parseInt(value)
    } catch {
      amount = parseInt(value.slice(0, -1))
    }
    dataStore.updateCartProduct({product: product.product, amount: amount})
  }

  return (
    <div
      className={styles.cartContainer}
    >
      <div
        className={styles.cartTitle}
      >
        Корзина
      </div>
      <div
        className={styles.cartProductsContainer}
      >
        {dataStore.cart.map((product, index) => {
          return (
            <div
             key={product.product.id}
             className={styles.cartProductContainer}
            >
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
                  className={styles.cartProductBodyContainer}
                >
                  <div
                    className={styles.cartProductTitleContainer}
                  >
                    <div
                      className={styles.cartProductTitle}
                    >
                      {product.product.name}
                    </div>
                    <div
                      className={styles.cartProductDeleteButton}
                      onClick={() => onDelete(product)}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5.99943 6.94224L10.1947 11.1375L11.1375 10.1947L6.94224 5.99943L11.1375 1.8042L10.1947 0.86139L5.99943 5.05662L1.80414 0.861328L0.861328 1.80414L5.05662 5.99943L0.861328 10.1947L1.80414 11.1375L5.99943 6.94224Z"
                          fill="#56585F"/>
                      </svg>

                    </div>
                  </div>
                  <div
                    className={styles.cartProductAmountAndPriceContainer}
                  >
                    <div
                      className={styles.cartProductAmountContainer}
                    >
                      <div
                        className={styles.cartProductAmountButton}
                        onClick={() => dataStore.updateCartProduct({...product, amount: product.amount - 1})}
                      >
                        <svg width="1vh" height="1vh" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd"
                                d="M11.3327 1.66732H0.666016V0.333984H11.3327V1.66732Z" fill="#1B1C1F"/>
                        </svg>
                      </div>
                      <input
                        className={styles.cartProductAmountInput}
                        onClick={(e) => e.currentTarget.select()}
                        type="text"
                        min={0}
                        onInput={(e) => onInput(e.currentTarget.value, product)}
                        value={dataStore.cart.find((cartItem) => cartItem.product === product.product)?.amount}
                      />
                      <div
                        className={styles.cartProductAmountButton}
                        onClick={() => dataStore.updateCartProduct({...product, amount: product.amount + 1})}
                      >
                        <svg width="1vh" height="1vh" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.66667 0H5.33333V5.33333H0V6.66667H5.33333V12H6.66667V6.66667H12V5.33333H6.66667V0Z"
                                fill="#1B1C1F"/>
                        </svg>
                      </div>
                    </div>
                    <div
                      className={styles.cartProductPriceContainer}
                    >
                      {product.product.previousPrice &&
                        <div
                          className={styles.cartProductPreviousPrice}
                        >
                          {(product.product.previousPrice * product.amount).toFixed(2)} ₽
                        </div>
                      }
                      {(product.product.price * product.amount).toFixed(2)} ₽
                    </div>
                  </div>
                </div>
              </div>
              {index < dataStore.cart.length - 1 && <hr className={styles.cartProductLine} key={index}/>}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Cart