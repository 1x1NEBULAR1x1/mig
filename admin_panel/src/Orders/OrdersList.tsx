import classes from '../Classes.module.css'
import {useOrdersStore} from "../stores/useOrdersStore.ts";
import {useCitiesStore} from "../stores/useCitiesStore.ts";


const OrdersList = () => {

  const ordersStore = useOrdersStore(state => state)

  const citiesStore = useCitiesStore(state => state)

  return (<div className={classes.menu}>
    <div className={classes.menuTitle}>Список активных заказов</div>
    <div className={classes.menuContainer}>
      {ordersStore.orders?.map(o => {
        if (o.address.cityId == citiesStore.city!.id) {
          return (
            <div
              className={classes.name}
              style={ordersStore.order?.id === o.id ? {color: '#1b9f01'} : {}}
              onClick={() => ordersStore.setOrder(o)}
            >
              #{o.id} - {o.status.name}
            </div>
          )
        }
      })}
    </div>
  </div>)
}

export default OrdersList