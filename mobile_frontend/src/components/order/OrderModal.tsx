import styles from './Order.module.css'
import { useOrderStore } from "../../../stores/useOrderStore.ts";
import {OrderCreate} from "../../../types/models.ts";
import {requestOrder} from "../../../requests/load_data.ts";
import {useDataStore} from "../../../stores/useDataStore.ts";
import {useUIStore} from "../../../stores/useUIStore.ts";
import {useTax} from "../../../hooks/useTax.ts";
import {useCitiesStore} from "../../../stores/useCitiesStore.ts";
import {useDeliveryPrice} from "../../../hooks/useDeliveryPrice.ts";
import {useState} from "react";

const OrderModal = ({ order }: { order: OrderCreate }) => {
  const orderStore = useOrderStore(state => state)
  const cardNumber = import.meta.env.VITE_CARD_NUMBER
  const cardOwner = import.meta.env.VITE_CARD_OWNER_FULL_NAME
  const citiesStore = useCitiesStore(state => state)
  const dataStore = useDataStore(state => state)
  const uiStore = useUIStore(state => state)
  const [clicked, setClicked] = useState(false)
  const deliveryCost = useDeliveryPrice({cityName: citiesStore.selectedCity!.name, house: orderStore.orderHouse, street: orderStore.orderStreet})
  const cartPrice = dataStore.cart.reduce((total, cartItem) => {
    return total + cartItem.amount * cartItem.product.price
  }, 0);
  const taxRate = useTax()
  let priorityPrice = 0
  if (orderStore.orderDeliveryPriority) {
    priorityPrice = cartPrice * (orderStore.orderDeliveryPriority!.extraCost / 100)
  }
  const tips = orderStore.paymentTips === 'Без чая' ? 0 : orderStore.paymentTips === '5%' ? cartPrice * 0.05 : orderStore.paymentTips === '10%' ? cartPrice * 0.1 : orderStore.paymentTips === '20%' ? cartPrice * 0.2 : 0
  const totalPrice = parseFloat(cartPrice.toFixed(2)) + parseFloat((deliveryCost.data || 0).toFixed(2)) + parseFloat(priorityPrice.toFixed(2)) + parseFloat((cartPrice * (taxRate.data || 0)  / 100).toFixed(2)) + parseFloat(tips.toFixed(2))


  const onCreate = async () => {
    setClicked(true)
    const newOrder = await requestOrder(order)
    if (newOrder) {
      addOrderIdsToCookies([newOrder.id])
      dataStore.setOrders([...dataStore.orders, newOrder])
      uiStore.setPaymentCheck(newOrder)
    }
  }

  const close = () => {
    uiStore.setPaymentCheck(undefined)
    orderStore.setOrder(undefined)
  }

  function getOrderIdsFromCookies(): number[] {
    const match = document.cookie.match(/(?:^|;\s*)orderIds=([^;]+)/);
    return match ? JSON.parse(decodeURIComponent(match[1])) : [];
  }

  function addOrderIdsToCookies(orderIds: number[]) {
    const existingOrderIds = getOrderIdsFromCookies();
    const updatedOrderIds = Array.from(new Set([...existingOrderIds, ...orderIds])); // Уникальные значения

    // Преобразуем обновленный массив в строку и сохраняем
    document.cookie = `orderIds=${encodeURIComponent(JSON.stringify(updatedOrderIds))}; path=/; max-age=3600`;
  }

  return (
    <>
      {order &&
        <div className={styles.orderModalOverlay} onClick={() => close()}>
          <div className={styles.orderModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.orderModalMainTitle}>
              Оплатите заказ
            </div>
            <div className={styles.orderModalElement} style={{cursor: 'pointer'}} onClick={() => navigator.clipboard.writeText(cardNumber)}>
              <div className={styles.orderModalTitle}>
                Номер карты
              </div>
              <div className={styles.orderModalCardNumber}>
                {cardNumber}
                <svg width="1.333vh" height="1.333vh" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.33333 0.5C0.873096 0.5 0.5 0.873096 0.5 1.33333V11.3333C0.5 11.7936 0.873096 12.1667 1.33333 12.1667H2.16667V2.16667H12.1667V1.33333C12.1667 0.873096 11.7936 0.5 11.3333 0.5H1.33333Z"
                    fill="#56585F"/>
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M4.66667 3.83333C4.20643 3.83333 3.83333 4.20643 3.83333 4.66667V14.6667C3.83333 15.1269 4.20643 15.5 4.66667 15.5H14.6667C15.1269 15.5 15.5 15.1269 15.5 14.6667V4.66667C15.5 4.20643 15.1269 3.83333 14.6667 3.83333H4.66667ZM5.5 13.8333V5.5H13.8333V13.8333H5.5Z"
                    fill="#56585F"/>
                </svg>
              </div>
            </div>
            <div className={styles.orderModalElement}>
              <div className={styles.orderModalTitle}>
                Получатель
              </div>
              <div className={styles.orderModalText}>
                {cardOwner}
              </div>
            </div>
            <div className={styles.orderModalElement}>
              <div className={styles.orderModalTitle}>
                Сумма
              </div>
              <div className={styles.orderModalText}>
                {totalPrice.toFixed(2)} ₽
              </div>
            </div>
            <div className={styles.orderModalWarning}>
              <svg width="1.6667vh" height="1.6667vh" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 8V13H12V8H10Z" fill="#EC4646"/>
                <path
                    d="M11 16.75C10.3096 16.75 9.75 16.1904 9.75 15.5C9.75 14.8096 10.3096 14.25 11 14.25C11.6904 14.25 12.25 14.8096 12.25 15.5C12.25 16.1904 11.6904 16.75 11 16.75Z"
                    fill="#EC4646"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M11.8742 0.514357C11.6978 0.196892 11.3632 0 11 0C10.6368 0 10.3022 0.196892 10.1258 0.514357L0.125843 18.5144C-0.0462301 18.8241 -0.0415561 19.2017 0.138129 19.5071C0.317815 19.8125 0.64568 20 1 20H21C21.3543 20 21.6822 19.8125 21.8619 19.5071C22.0416 19.2017 22.0462 18.8241 21.8742 18.5144L11.8742 0.514357ZM11 3.05913L19.3005 18H2.69951L11 3.05913Z"
                      fill="#EC4646"/>
              </svg>
              Переводите ровно ту сумму, что указана в информации к<br /> оплате, в противном случае вы потеряете свои
              средства
            </div>
            {!uiStore.paymentCheck
              ? <div className={styles.orderModalButtonContainer}>
                <div
                  className={styles.orderModalButton}
                  style={!clicked ? {background: '#1B9F01', color: '#EEEFF3', cursor: 'pointer'} : {background: '#EEEFF3', color: '#56585F'}}
                  onClick={() => onCreate()}
                >
                  Я оплатил
                </div>
                <div
                  className={styles.orderModalButton}
                  style={{background: '#EEEFF3', color: '#1B1C1F', cursor: 'pointer'}}
                  onClick={() => orderStore.setOrder(undefined)}
                >
                  Отменить заказ
                </div>
              </div>
              : <>
                <div
                  className={styles.orderModalButton}
                  style={{background: '#EEEFF3', color: '#BDBFC9', width: '100%'}}
                >
                  Проверяем поступление средств
                </div>
                <div className={styles.orderModalButtonContainer}>
                  <div
                    className={styles.orderModalButton}
                    style={{background: '#000000', color: '#FFFFFF'}}
                    onClick={() => onCreate()}
                  >
                    Телефон поддержки
                  </div>
                  <div
                    className={styles.orderModalButton}
                    style={{background: '#EEEFF3', color: '#1B1C1F'}}
                    onClick={() => orderStore.setOrder(undefined)}
                  >
                    Чат с поддержкой
                  </div>
                </div>
              </>}
					</div>
				</div>}
    </>
  )
}

export default OrderModal