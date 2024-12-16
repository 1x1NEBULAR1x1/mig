import styles from "../header/Header.module.css";
import {url} from "../../../requests/load_data.ts";
import {Order} from "../../../types/models.ts";
import {useUIStore} from "../../../stores/useUIStore.ts";
import { useDataStore } from "../../../stores/useDataStore.ts";


const OrderCard = ({order}: {order: Order}) => {
  const uiStore = useUIStore((state) => state);
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
  const totalPrice = parseFloat(cartPrice.toFixed(2)) + parseFloat((order.deliveryPrice).toFixed(2)) + parseFloat(priorityPrice.toFixed(2)) + parseFloat((cartPrice * (order.tax || 0)  / 100).toFixed(2)) + parseFloat(tips.toFixed(2))

  return(<>
    <div
      className={styles.profileOrderCard}
      onClick={() => {
        uiStore.setViewOrder(order);
        uiStore.setIsProfileOpened(false);
      }}
    >
      <div className={styles.profileOrderHeader}>
        <div
          className={styles.profileOrderStatusAndPrice}
        >
          <div
            className={styles.profileOrderStatus}
          >
            {order.status.name}
            <svg width="1.3333vh" height="1.3333vh" viewBox="0 0 8 14" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M7.67859 7.29505L1.84526 13.1284L0.666748 11.9499L5.91083 6.70579L0.666748 1.46171L1.84526 0.283203L7.67859 6.11654C8.00403 6.44197 8.00403 6.96961 7.67859 7.29505Z"
                    fill="#1B9F01"/>
            </svg>
          </div>
          <div
            className={styles.profileOrderPrice}
          >
            {totalPrice.toFixed(2)} ₽
          </div>
        </div>
        <div
          className={styles.profileOrderText}
        >
          Активный заказ
        </div>
      </div>
      <div className={styles.profileOrderProductList}>
        {order.products.slice(0, 4).map((product, index) => (
          <div key={`order#${order.id}-product#${product.productId}-index#${index}`} className={styles.profileOrderImg}>
            <img className='rounded-3xl' src={url + (product.product.imagePath)} alt={product.product.name}/>
          </div>
        ))}
        {order.products.length > 4 && (
          <div className={styles.profileOrderImg}>
            +{order.products.length - 4}
          </div>
        )}
      </div>
    </div>
  </>)
}

export default OrderCard