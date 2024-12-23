import styles from './History.module.css';
import { Order } from "../../../types/models.ts";
import { useUIStore } from "../../../stores/useUIStore.ts";
import {url} from "../../../requests/load_data.ts";
import {useDataStore} from "../../../stores/useDataStore.ts";

const HistoryOrder = ({order, isActive}: {order: Order, isActive: boolean}) => {

  const uiStore = useUIStore(state => state)
  const dataStore = useDataStore((state) => state);
  const cartPrice = order.products.reduce((total, cartItem) => {
    return total + cartItem.amount * cartItem.product.price
  }, 0);
  let priorityPrice = 0
  const priority = dataStore.orderPriorities.find(p => p.id == order.priorityId)
  if (priority?.extraCost) {
    priorityPrice = cartPrice * (priority.extraCost / 100)
  }
  const tips = order.curierTips
  const totalPrice = parseFloat(cartPrice.toFixed(2)) + parseFloat((order.deliveryPrice).toFixed(2)) + parseFloat(priorityPrice.toFixed(2)) + parseFloat((order.tax || 0).toFixed(2)) + parseFloat(tips.toFixed(2))

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  };

  return (
    <div
      style={uiStore.viewOrderHistory == order ? {border: "1px solid #1B9F01", cursor: 'pointer'} : {border: "1px solid #FFFFFF", cursor: 'pointer'}}
      className={isActive ? styles.historyActiveOrder : styles.historyOrder}
      onClick={() => {uiStore.setViewOrderHistory(undefined); uiStore.setViewOrderHistory(order)}}
    >
      <div className={isActive ? styles.historyActiveOrderHeader : styles.historyOrderHeader}>
        <div className={styles.historyOrderStatusContainer}>
          <div className={isActive ? styles.historyActiveOrderStatus : styles.historyOrderStatus}>
            {isActive ? order.status.name : new Date(order.created).toLocaleDateString('ru-RU', options)}
            {isActive ?
              <svg width="1.333vh" height="1.333vh" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M7.67853 7.29505L1.8452 13.1284L0.666687 11.9499L5.91076 6.70579L0.666687 1.46171L1.8452 0.283203L7.67853 6.11654C8.00397 6.44197 8.00397 6.96961 7.67853 7.29505Z"
                      fill="#1B9F01"/>
              </svg> :
              <svg width="1.333vh" height="1.333vh" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M7.67851 7.29465L1.84518 13.128L0.666667 11.9495L5.91074 6.70539L0.666667 1.46131L1.84518 0.282801L7.67851 6.11613C8.00395 6.44157 8.00395 6.96921 7.67851 7.29465Z"
                      fill="#1B1C1F"/>
              </svg> }
          </div>
          <div className={styles.historyOrderPrice}>
            {totalPrice.toFixed(2)} ₽
          </div>
        </div>
        <div
          style={order.status.name === 'Отменён' ? {color: '#EC4646'} : {}}
          className={isActive ? styles.historyActiveOrderTextContainer : styles.historyOrderTextContainer}
        >
          {order.status.name}
        </div>
      </div>
      <div className={styles.historyOrderProductList}>
      {order.products.slice(0, 4).map((product, index) => (
          <div key={index} className={styles.historyOrderProductImage}>
            <img src={url + (product.product.imagePath || "/static/image_not_found.png")} alt={product.product.name} />
          </div>
        ))}
        {order.products.length > 4 && (
          <div className={styles.historyOrderProductImage}>
            +{order.products.length - 4}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryOrder