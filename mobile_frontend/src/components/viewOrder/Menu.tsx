import styles from "./ViewOrder.module.css";
import orderStyles from "../history/History.module.css";
import { useUIStore } from "../../../stores/useUIStore.ts";
import {url} from "../../../requests/load_data.ts";
import {useDataStore} from "../../../stores/useDataStore.ts";


const Menu = () => {
  const uiStore = useUIStore(state => state)
  const dataStore = useDataStore((state) => state);
  if (!uiStore.viewOrder) return null
  const cartPrice = uiStore.viewOrder.products.reduce((total, cartItem) => {
    return total + cartItem.amount * cartItem.product.price
  }, 0);
  let priorityPrice = 0
  const priority = dataStore.orderPriorities.find(p => p.id == uiStore.viewOrder!.priorityId)
  if (priority?.extraCost) {
    priorityPrice = cartPrice * (priority.extraCost / 100)
  }
  const tips = uiStore.viewOrder.curierTips
  const totalPrice = parseFloat(cartPrice.toFixed(2)) + parseFloat((uiStore.viewOrder.deliveryPrice).toFixed(2)) + parseFloat(priorityPrice.toFixed(2)) + parseFloat(uiStore.viewOrder.tax.toFixed(2)) + parseFloat(tips.toFixed(2))


  return (
    <div className={styles.menu}>
      <div className={styles.menuHeader}>
        <div className={styles.menuHeaderStatus}>
          <div
              className={styles.menuHeaderStatusContainer}
              style={uiStore.viewOrder!.status.id >= 1 ? {
                backgroundColor: '#1B9F01',
                fill: '#FFFFFF'
              } : {backgroundColor: '#FFFFFF', fill: '#BDBFC9'}}
          >
            <svg width="1.667vh" height="1.667vh" viewBox="0 0 18 14" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M17.4572 2.3107L6.95718 12.8107C6.56666 13.2012 5.93349 13.2012 5.54297 12.8107L0.542969 7.8107L1.95718 6.39648L6.25008 10.6894L16.043 0.896484L17.4572 2.3107Z"
              />
            </svg>
          </div>
          <hr className={styles.menuHeaderStatusLine}/>
          <div
              className={styles.menuHeaderStatusContainer}
              style={uiStore.viewOrder!.status.id >= 2 ? {
                backgroundColor: '#1B9F01',
                fill: '#FFFFFF'
              } : {backgroundColor: '#FFFFFF', fill: '#BDBFC9'}}
          >
            <svg width="1.667vh" height="1.667vh" viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.66699 6V10H10.667V6H8.66699Z"/>
              <path d="M12.667 10V6H14.667V10H12.667Z"/>
              <path d="M16.667 6V10H18.667V6H16.667Z"/>
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M0.666992 0H3.04896C3.8065 0 4.49903 0.428004 4.83781 1.10557L5.28503 2H21.4472C22.7093 2 23.6559 3.15465 23.4083 4.39223L21.9691 11.5883C21.6887 12.9904 20.4581 14 19.0278 14H6.66699C6.11471 14 5.66699 14.4477 5.66699 15C5.66699 15.5523 6.11471 16 6.66699 16H21.667V18H20.5816C20.6369 18.1564 20.667 18.3247 20.667 18.5C20.667 19.3284 19.9954 20 19.167 20C18.3386 20 17.667 19.3284 17.667 18.5C17.667 18.3247 17.6971 18.1564 17.7523 18H8.58164C8.63692 18.1564 8.66699 18.3247 8.66699 18.5C8.66699 19.3284 7.99542 20 7.16699 20C6.33856 20 5.66699 19.3284 5.66699 18.5C5.66699 18.2765 5.71587 18.0644 5.80352 17.8739C4.56756 17.503 3.66699 16.3567 3.66699 15C3.66699 13.7591 4.42039 12.6942 5.49472 12.2377L3.71268 3.32743L3.04896 2H0.666992V0ZM5.8868 4L7.4868 12H19.0278C19.5042 12 19.9144 11.6638 20.008 11.1961L21.4472 4H5.8868Z"
              />
            </svg>
          </div>
          <hr className={styles.menuHeaderStatusLine}/>
          <div
              className={styles.menuHeaderStatusContainer}
              style={uiStore.viewOrder!.status.id >= 3 ? {
                backgroundColor: '#1B9F01',
                fill: '#FFFFFF'
              } : {backgroundColor: '#FFFFFF', fill: '#BDBFC9'}}
          >
            <svg width="1.667vh" height="1.667vh" viewBox="0 0 21 22" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M12.333 0C15.0944 0 17.333 2.23858 17.333 5C17.333 7.76142 15.0944 10 12.333 10C9.57158 10 7.33301 7.76142 7.33301 5C7.33301 2.23858 9.57158 0 12.333 0ZM15.333 5C15.333 3.34315 13.9899 2 12.333 2C10.6762 2 9.33301 3.34315 9.33301 5C9.33301 6.65685 10.6762 8 12.333 8C13.9899 8 15.333 6.65685 15.333 5Z"
              />
              <path
                  d="M11.8329 11C17.2433 11 20.333 15.5983 20.333 20H18.333C18.333 16.4017 15.8599 13 11.8329 13C10.7726 13 9.83929 13.2294 9.0354 13.6215L8.25146 11.7794C9.30834 11.2808 10.5102 11 11.8329 11Z"
              />
              <path
                  d="M0.333008 18H5.91887L3.62598 20.2929L5.04019 21.7071L9.04019 17.7071C9.43071 17.3166 9.43071 16.6834 9.04019 16.2929L5.04019 12.2929L3.62598 13.7071L5.91887 16H0.333008V18Z"
              />
            </svg>
          </div>
          <hr className={styles.menuHeaderStatusLine}/>
          <div
              className={styles.menuHeaderStatusContainer}
              style={uiStore.viewOrder!.status.id >= 4 ? {
                backgroundColor: '#1B9F01',
                fill: '#FFFFFF'
              } : {backgroundColor: '#FFFFFF', fill: '#BDBFC9'}}
          >
            <svg width="1.667vh" height="1.667vh" viewBox="0 0 22 15" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M16 0H13V2H15.4648L16.2582 3.19015C13.9957 3.69252 12.0937 5.15302 11 7.12399C9.63527 4.66458 7.01203 3 4 3H2V5H4C5.29585 5 6.49576 5.41081 7.47659 6.10929L6.03202 7.55385C5.4365 7.20194 4.74183 7 4 7C1.79086 7 0 8.79086 0 11C0 13.2091 1.79086 15 4 15C6.20914 15 8 13.2091 8 11C8 10.2582 7.79808 9.56359 7.44621 8.96809L8.89079 7.52352C9.58922 8.50433 10 9.70419 10 11C10 11.5523 10.4477 12 11 12C11.5523 12 12 11.5523 12 11C12 9.70419 12.4108 8.50433 13.1092 7.52352L14.5538 8.96809C14.2019 9.56359 14 10.2582 14 11C14 13.2091 15.7909 15 18 15C20.2091 15 22 13.2091 22 11C22 8.79086 20.2091 7 18 7C17.2582 7 16.5635 7.20194 15.968 7.55385L14.5234 6.10929C15.5042 5.41081 16.7041 5 18 5C18.3688 5 18.7077 4.79702 18.8817 4.47186C19.0557 4.1467 19.0366 3.75216 18.8321 3.4453L16.8321 0.4453C16.6466 0.167101 16.3344 0 16 0ZM4 9C2.89543 9 2 9.89543 2 11C2 12.1046 2.89543 13 4 13C5.10457 13 6 12.1046 6 11C6 9.89543 5.10457 9 4 9ZM18 9C16.8954 9 16 9.89543 16 11C16 12.1046 16.8954 13 18 13C19.1046 13 20 12.1046 20 11C20 9.89543 19.1046 9 18 9Z"
              />
            </svg>
          </div>
        </div>
        <div className={styles.menuHeaderText}>
          <div className={styles.menuHeaderTextTitle}>
            {uiStore.viewOrder!.status.fullStatus}
          </div>
          {uiStore.viewOrder!.status.description} {uiStore.viewOrder!.status.id === 4 && uiStore.viewOrder!.timeToDelivery}
        </div>
        <div className={styles.menuHeaderButtons}>
          <div className={styles.menuHeaderButtonSupportPhone}>
            Телефон поддержки
          </div>
          <div className={styles.menuHeaderButtonSupportChat}>
            Чат с поддержкой
          </div>
        </div>
      </div>
      <div className={styles.menuBody}>
        <div className={styles.menuBodyTitle}>
          Детали заказа
          <svg
            onClick={() => uiStore.setIsProductListOpened(!uiStore.isProductListOpened)}
            style={uiStore.isProductListOpened ? {} : {transform: 'rotateX(180deg)'}}
            width="1.33vh" height="1.33vh" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.29297 0.292894L0.292969 7.29289L1.70718 8.70711L8.00008 2.41421L14.293 8.70711L15.7072 7.29289L8.70718 0.292894C8.31666 -0.0976312 7.68349 -0.0976312 7.29297 0.292894Z"
                  fill="#1B1C1F"/>
          </svg>
        </div>
        {uiStore.isProductListOpened &&
					<div className='flex-col flex gap-2'>
            {uiStore.viewOrder?.products.map((product, index) => {
              return (
                <div key={index} className={orderStyles.orderProductContainer}>
                  <div className={orderStyles.orderProduct}>
                    <div className={orderStyles.orderProductImage} style={{height: '7vh'}}>
                      <img
                        src={url + (product.product.imagePath || "/static/image_not_found.png")}
                        alt={product.product.name}
                        style={{height: '7vh'}}/>
                    </div>
                    <div className={orderStyles.orderProductData} style={{height: '7vh'}}>
                      <div className={orderStyles.orderProductName}>
                        {product.product.name}
                      </div>
                      <div className={orderStyles.orderAmountAndPrice}>
                        {product.amount} шт.
                        <div className={orderStyles.orderProductPrice}>
                          {product.product.previousPrice &&
														<div className={orderStyles.orderProductPreviousPrice}>
                              {product.product.previousPrice}
														</div>
                          }
                          {product.product.price} ₽
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < uiStore.viewOrder!.products.length - 1 &&
										<hr className={orderStyles.historyLine} key={index}/>}
                </div>
              )
            })}
					</div>}
        <hr className={orderStyles.historyLine}/>
        <div className={styles.menuBodyElement}>
          <div className={styles.menuBodyElementTitle}>Способ оплаты</div>
          <div className={styles.menuBodyElementContainer}>Перевод
            <svg width="1.667vh" height="1.667vh" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 0H16V5.58594L18.293 3.29297L19.7072 4.70718L15.7072 8.70718C15.3167 9.09771 14.6835 9.09771 14.293 8.70718L10.293 4.70718L11.7072 3.29297L14 5.58579V0Z"
                fill="#1B1C1F"/>
              <path
                d="M0 6C0 4.34315 1.34315 3 3 3H8V5H3C2.44772 5 2 5.44772 2 6L2 7H8V9H2V16C2 16.5523 2.44771 17 3 17H17C17.5523 17 18 16.5523 18 16V9L20 9V16C20 17.6569 18.6569 19 17 19H3C1.34315 19 0 17.6569 0 16V6Z"
                fill="#1B1C1F"/>
            </svg>
          </div>
        </div>
        <div className={styles.menuBodyElement}>
          <div className={styles.menuBodyElementTitle}>Адрес доставки</div>
          <div className={styles.menuBodyElementContainer}>
            ул. {uiStore.viewOrder?.address.street} {uiStore.viewOrder?.address.house},
            кв. {uiStore.viewOrder?.address.flat},
            п. {uiStore.viewOrder?.address.floor}, {uiStore.viewOrder?.address.entrance} этаж
            <div className={styles.menuBodyDeliveryPrice}>{uiStore.viewOrder?.deliveryPrice + " ₽"}</div>
          </div>
        </div>
        {uiStore.viewOrder && uiStore.viewOrder?.tax > 0 && <div className={styles.menuBodyElement}>
          <div className={styles.menuBodyElementTitle}>Налог</div>
          <div className={styles.menuBodyElementContainer}>{uiStore.viewOrder?.tax.toFixed(2)} ₽</div>
        </div>}
        {priorityPrice > 0 && <div className={styles.menuBodyElement}>
          <div className={styles.menuBodyElementTitle}>Дополнительная плата за скороть доставки</div>
          <div className={styles.menuBodyElementContainer}>{priorityPrice.toFixed(2)} ₽</div>
        </div>}
        <div className={styles.menuBodyOrderPriceText}>Итого:
          <div className={styles.menuBodyOrderPrice}>{totalPrice.toFixed(2) + " ₽"}</div>
        </div>
      </div>
    </div>
  )
}

export default Menu