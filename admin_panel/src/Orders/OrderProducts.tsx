import classes from '../Classes.module.css'
import {useOrdersStore} from "../stores/useOrdersStore.ts";

const OrderProducts = () => {

  const ordersStore = useOrdersStore(state => state)

  return (<div className={classes.menu}>
    <div className={classes.menuTitle}>Список продуктов</div>
    <div className={classes.menuContainer}>
      {ordersStore.order?.products?.map(p => {
        return (<div
          className={classes.name}
          key={`order${p.orderId}_product${p.productId}`}
        >
          {p.product.name} x{p.amount} - (филиал №{p.branchId})
        </div>)
      })}
    </div>
  </div>)
}

export default OrderProducts