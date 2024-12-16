import styles from './Catalog.module.css'
import { useDataStore } from "../../../stores/useDataStore";
import { type Product } from "../../../types/models";
import { useUIStore } from "../../../stores/useUIStore";
import {url} from "../../../requests/load_data.ts";


const Product = ({product}: {product: Product}) => {

  const dataStore = useDataStore(state => state);

  const uiStore = useUIStore(state => state);

  const isInCart = dataStore.cart.some((cartItem) => cartItem.product === product);

  const onInput = (value: string) => {
    if (value === '') {
      dataStore.updateCartProduct({product: product, amount: 0})
      return
    }
    let amount: number
    try {
      amount = parseInt(value)
    } catch {
      amount = parseInt(value.slice(0, -1))
    }
    dataStore.updateCartProduct({product: product, amount: amount})
  }

  return (
    <div
      className={styles.productCard}
    >
      <div className='flex-col w-full flex flex-1'>
        <div className={styles.productTags}>
        {product.tags?.map((tag) => (
            <div
              key={tag.name}
              className={styles.productTag}
              style={{
                backgroundColor: tag.firstColor,
                color: tag.secondColor
              }}
            >
              {tag.name}
            </div>
          )
        )}
      </div>
        <div className={styles.productImage} onClick={() => uiStore.setSelectedProduct({product: product, amount: 1})}>
        <img
          src={url + (product.imagePath || "/static/image_not_found.png")}
          alt={product.name}
        />
      </div>
      </div>
      <div className='flex flex-1 flex-col max-h-[24%] gap-[0.5vh]'>
        <div className={styles.productPrice}>
        {product.price} ₽
        {product.previousPrice &&
          <div
            className={styles.productPreviousPrice}
          >
            {product.previousPrice} ₽
          </div>
        }
      </div>
        <div className={styles.productName}>{product.name}</div>
        <div className={styles.productAmount}>{product.amount} {product.unitsOfMeasure}</div>
      </div>
      <div className='flex flex-row w-full'>
        {!isInCart && <div className={styles.productBuyButton} onClick={() => {
              dataStore.addToCart(({product: product, amount: 1}))
            }}>В корзину
            <svg width="1.0416667vw" height="1.5vh" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.91667 5.66602V8.99935H8.58333V5.66602H6.91667Z" fill="#1B1C1F"/>
              <path d="M10.25 8.99935V5.66602H11.9167V8.99935H10.25Z" fill="#1B1C1F"/>
              <path d="M13.5833 5.66602V8.99935H15.25V5.66602H13.5833Z" fill="#1B1C1F"/>
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M0.25 0.666016H2.23497C2.86626 0.666016 3.44336 1.02269 3.72568 1.58733L4.09836 2.33268H17.5668C18.6186 2.33268 19.4074 3.29489 19.2011 4.32621L18.0018 10.323C17.7681 11.4913 16.7426 12.3327 15.5507 12.3327H5.25C4.78976 12.3327 4.41667 12.7058 4.41667 13.166C4.41667 13.6263 4.78976 13.9993 5.25 13.9993H17.75V15.666H16.8455C16.8916 15.7963 16.9167 15.9366 16.9167 16.0827C16.9167 16.773 16.357 17.3327 15.6667 17.3327C14.9763 17.3327 14.4167 16.773 14.4167 16.0827C14.4167 15.9366 14.4417 15.7963 14.4878 15.666H6.84554C6.8916 15.7963 6.91667 15.9366 6.91667 16.0827C6.91667 16.773 6.35702 17.3327 5.66667 17.3327C4.97631 17.3327 4.41667 16.773 4.41667 16.0827C4.41667 15.8964 4.4574 15.7197 4.53044 15.5609C3.50048 15.2519 2.75 14.2966 2.75 13.166C2.75 12.1319 3.37783 11.2445 4.27311 10.8641L2.78807 3.43888L2.23497 2.33268H0.25V0.666016ZM4.59984 3.99935L5.93317 10.666H15.5507C15.9477 10.666 16.2895 10.3858 16.3675 9.99611L17.5668 3.99935H4.59984Z"
                    fill="#1B1C1F"/>
            </svg>
          </div>}
        {isInCart &&
          <div className={styles.productAddButtonContainer}>
            <div className={styles.productAddButtons}>
              <div className={styles.productAddButton} onClick={() => {
                  dataStore.updateCartProduct({
                    product: product,
                    amount: dataStore.cart.find((cartItem) => cartItem?.product === product)!.amount - 1}
                  )
                }}>
                <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.6673 1.83268H0.333984V0.166016H13.6673V1.83268Z" fill="#EEEFF3"/>
                </svg>
              </div>
              <div className={styles.productAmountInCart}>
                <input
                  onClick={(e) => e.currentTarget.select()}
                  className={styles.productAmountInput}
                  type="text"
                  min={0}
                  onInput={(e) => onInput(e.currentTarget.value)}
                  value={dataStore.cart.find((cartItem) => cartItem?.product === product)?.amount}
                />
              </div>
              <div
                className={styles.productAddButton}
                onClick={() => {
                  dataStore.updateCartProduct({
                    product: product,
                    amount: dataStore.cart.find((cartItem) => cartItem?.product === product)!.amount + 1}
                  )
                }}
              >
                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.33333 0.5H6.66667V7.16667H0V8.83333H6.66667V15.5H8.33333V8.83333H15V7.16667H8.33333V0.5Z" fill="#EEEFF3"/>
                </svg>
              </div>
            </div>
            <div
              className={styles.productRemoveButton}
              onClick={() => {
                dataStore.removeAllFromCart(dataStore.cart.find((cartItem) => cartItem?.product === product)!)
              }}
            >
              <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.50075 8.17926L11.7448 13.4233L12.9233 12.2448L7.67926 7.00075L12.9233 1.75671L11.7448 0.578202L6.50075 5.82224L1.25664 0.578125L0.078125 1.75664L5.32224 7.00075L0.078125 12.2449L1.25664 13.4234L6.50075 8.17926Z"
                  fill="#1B1C1F"/>
              </svg>
            </div>
          </div>}
      </div>
    </div>
  );
}

export default Product