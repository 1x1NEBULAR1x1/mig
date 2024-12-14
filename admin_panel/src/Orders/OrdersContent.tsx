import classes from '../Classes.module.css'
import {useOrdersStore} from "../stores/useOrdersStore.ts";
import OrdersCities from "./OrdersCities.tsx";
import {useCitiesStore} from "../stores/useCitiesStore.ts";
import {useEffect} from "react";
import {getOrders, getPriorities, getStatuses} from '../requests/orders.ts';
import OrdersList from "./OrdersList.tsx";
import OrderUpdate from "./OrderUpdate.tsx";
import OrderProducts from "./OrderProducts.tsx";


const OrdersContent = () => {

  const ordersStore = useOrdersStore(state => state)

  const citiesStore = useCitiesStore(state => state)

  useEffect(() => {
    getOrders().then(orders => ordersStore.setOrders(orders))
    getStatuses().then(statuses => ordersStore.setStatuses(statuses))
    getPriorities().then(priorities => ordersStore.setPriorities(priorities))
  }, []);

  return (<div className={classes.content}>
    <OrdersCities />
    {citiesStore.city && <OrdersList />}
    {ordersStore.order && <OrderUpdate />}
    {ordersStore.order && <OrderProducts />}
  </div>)
}

export default OrdersContent