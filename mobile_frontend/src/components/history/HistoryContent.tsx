import styles from './History.module.css'
import contentStyles from '../Content.module.css'
import { useUIStore } from "../../../stores/useUIStore.ts";
import HistoryOrder from "./HistoryOrder.tsx";
import { useDataStore } from "../../../stores/useDataStore.ts";
import {url} from "../../../requests/load_data.ts";

const HistoryContent = () => {

  const uiStore = useUIStore(state => state)

  const dataStore = useDataStore(state => state)
  const cartPrice = uiStore.viewOrderHistory?.products.reduce((total, cartItem) => {
    return total + cartItem.amount * cartItem.product.price
  }, 0) || 0;
  let priorityPrice = 0
  const priority = dataStore.orderPriorities.find(p => p.id == uiStore.viewOrderHistory?.priorityId)
  if (priority?.extraCost) {
    priorityPrice = cartPrice * (priority.extraCost / 100)
  }
  const tips = uiStore.viewOrderHistory?.curierTips || 0
  const totalPrice = parseFloat(cartPrice.toFixed(2)) + parseFloat((uiStore.viewOrderHistory?.deliveryPrice || 0).toFixed(2)) + parseFloat(priorityPrice.toFixed(2)) + parseFloat((cartPrice * (uiStore.viewOrderHistory?.tax || 0)  / 100).toFixed(2)) + parseFloat(tips.toFixed(2))


  if (dataStore.orders.length === 0) {
    return (
      <div className={contentStyles.contentLong}>
        <div className={styles.history}>
          История пуста
        </div>
      </div>
    )
  }

  return (
    <div className={styles.contentLong}>
      <div className={styles.history}>
        <div className={styles.historyPath}>
          <div onClick={() => uiStore.setSelectedCategory(undefined)}>
            Главная&nbsp;/&nbsp;
          </div>
          <div onClick={() => uiStore.setIsProfileOpened(true)}>
            Профиль&nbsp;
          </div>
          /&nbsp;
          История заказов
        </div>
        <div className={styles.historyTitle}>
          История заказов
          <div
            onClick={() => uiStore.setIsHistoryListOpened(!uiStore.isHistoryListOpened)}
            className={styles.historyButton}>
            {!uiStore.isHistoryListOpened ?
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.29297 8.41421L0.292969 1.41421L1.70718 0L8.00008 6.29289L14.293 0L15.7072 1.41421L8.70718 8.41421C8.31666 8.80474 7.68349 8.80474 7.29297 8.41421Z" fill="#1B1C1F"/>
              </svg>
              : <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.41433 5.89953L11.657 1.65689L10.2428 0.242679L6.00012 4.48532L1.75748 0.242676L0.343266 1.65689L4.58591 5.89953L0.343262 10.1422L1.75748 11.5564L6.00012 7.31374L10.2428 11.5564L11.657 10.1422L7.41433 5.89953Z" fill="#1B1C1F"/>
              </svg>
            }
          </div>
        </div>
        {<div className={styles.historyOrderListContainer} style={uiStore.isHistoryListOpened ? {} : {display: "none"}}>{dataStore.orders.filter(order => order.status.id !== 0 && order.status.id !== 5).map(order => {
          return (
            <HistoryOrder
              key={order.id}
              order={order}
              isActive={true}
            />
          )
        })}
          {dataStore.orders.filter(order => order.status.id == 5).length !== 0 &&
            dataStore.orders.filter(order => order.status.id !== 5).length !== 0 &&
						<hr className={styles.historyLine}/>
          }
          {dataStore.orders.filter(order => order.status.id == 5 || order.status.id == 0).map(order => {
            return (
              <HistoryOrder
                key={order.id}
                order={order}
                isActive={false}
              />
            )
          })}</div>}
      </div>
      <div className={styles.order}>
        {uiStore.viewOrderHistory && <>
					<div className={styles.orderTitle}>
						Детали заказа
					</div>
					<div className={styles.orderProductList}>
          {uiStore.viewOrderHistory?.products.map((product, index) => {
              return (
                <div key={index} className={styles.orderProductContainer}>
                  <div className={styles.orderProduct}>
                    <div className={styles.orderProductImage}>
                      <img src={url + (product.product.imagePath || "/static/image_not_found.png")} alt={product.product.name} />
                    </div>
                    <div className={styles.orderProductData}>
                      <div className={styles.orderProductName}>
                        {product.product.name}
                      </div>
                      <div className={styles.orderAmountAndPrice}>
                        {product.amount} шт.
                        <div className={styles.orderProductPrice}>
                          {product.product.previousPrice &&
                            <div className={styles.orderProductPreviousPrice}>
                              {product.product.previousPrice} ₽
                            </div>
                          }
                          {product.product.price} ₽
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < uiStore.viewOrderHistory!.products.length - 1 && <hr className={styles.historyLine} key={index}/>}
                </div>
              )
            })}
          </div>
          <hr className={styles.historyLine} />
          <div className={styles.orderElement}>
            <div className={styles.orderElementTitle}>Способ оплаты</div>
            <div className={styles.orderElementBig}>
              {uiStore.viewOrderHistory?.paymentMethod}
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
          <div className={styles.orderElement}>
            <div className={styles.orderElementTitle}>Адрес доставки</div>
            <div className={styles.orderElementBig}>
              ул. {uiStore.viewOrderHistory?.address.street} {uiStore.viewOrderHistory?.address.house}, кв. {uiStore.viewOrderHistory?.address.flat}, п. {uiStore.viewOrderHistory?.address.floor}, {uiStore.viewOrderHistory?.address.entrance} этаж
              <p className={styles.orderDeliveryPrice}>
                {uiStore.viewOrderHistory?.deliveryPrice} ₽
              </p>
            </div>
            <div className={styles.orderElementSmall} onClick={() => {uiStore.setViewOrder(uiStore.viewOrderHistory); uiStore.setViewOrderHistory(undefined)}}>
              <svg width="1.5vh" height="1.5vh" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M11 2.1216L6.26682 0.543882C6.24885 0.53781 6.2307 0.53236 6.21241 0.527537C6.14244 0.509084 6.07104 0.499995 5.99996 0.5C5.92888 0.499995 5.85748 0.509084 5.78751 0.527537C5.76922 0.53236 5.75107 0.53781 5.7331 0.543882L0.736436 2.20944C0.396151 2.32287 0.166626 2.64131 0.166626 3.00001V14.6667C0.166626 14.9345 0.295394 15.1861 0.512701 15.3427C0.730008 15.4993 1.00936 15.542 1.26348 15.4572L6.26348 13.7906C6.60377 13.6771 6.83329 13.3587 6.83329 13V2.48953L10.1666 3.60064V6.33334H11.8333V3.60064L15.1666 2.48953V7.16667H16.8333V1.33334C16.8333 1.06547 16.7045 0.81393 16.4872 0.657304C16.2699 0.500678 15.9906 0.458062 15.7364 0.54277L11 2.1216ZM5.16663 2.48953V12.3994L1.83329 13.5105V3.60064L5.16663 2.48953Z"
                      fill="#1B1C1F"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M8.49996 11.75C8.49996 9.67894 10.1789 8.00001 12.25 8.00001C14.321 8.00001 16 9.67894 16 11.75C16 12.4838 15.7892 13.1684 15.4249 13.7465L17.4225 15.7441L16.244 16.9226L14.2464 14.925C13.6683 15.2892 12.9837 15.5 12.25 15.5C10.1789 15.5 8.49996 13.8211 8.49996 11.75ZM12.25 9.66667C11.0994 9.66667 10.1666 10.5994 10.1666 11.75C10.1666 12.9006 11.0994 13.8333 12.25 13.8333C13.4006 13.8333 14.3333 12.9006 14.3333 11.75C14.3333 10.5994 13.4006 9.66667 12.25 9.66667Z"
                      fill="#1B1C1F"/>
              </svg>
              Показать на карте
            </div>
            {uiStore.viewOrderHistory && uiStore.viewOrderHistory?.tax > 0 && <div className={styles.orderElement}>
              <div className={styles.orderElementTitle}>Налог</div>
              <div className={styles.orderElementBig}>{uiStore.viewOrderHistory?.tax.toFixed(2)} ₽</div>
            </div>}
            {priorityPrice > 0 && <div className={styles.orderElement}>
              <div className={styles.orderElementTitle}>Дополнительная плата за скороть доставки</div>
              <div className={styles.orderElementBig}>{priorityPrice.toFixed(2)} ₽</div>
            </div>}
            <hr className={styles.historyLine} />
            <div className={styles.orderPriceText}>
              Итого:
              <div className={styles.orderPrice}>
                {totalPrice.toFixed(2)} ₽
              </div>
            </div>
          </div>
        </>}
        {!uiStore.viewOrderHistory &&
          <div className={styles.orderTitle}>
            Выберите заказ для просмотра информации о нём
          </div>}
      </div>
    </div>
  )
}

export default HistoryContent