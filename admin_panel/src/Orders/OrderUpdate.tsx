import classes from '../Classes.module.css'
import {useOrdersStore} from "../stores/useOrdersStore.ts";
import {useEffect, useState} from "react";
import {getOrders, getPriorities, updateOrder} from "../requests/orders.ts";
import {useSettingsStore} from "../stores/useSettingsStore.ts";
import {OrderPriorityRead} from "../models.ts";


const OrderUpdate = () => {

  const ordersStore = useOrdersStore(state => state)

  const o = ordersStore.order

  const [totalPrice, setTotalPrice] = useState<string>(o?.totalPrice.toString() || '')

  const [deliveryPrice, setDeliveryPrice] = useState<string>(o?.deliveryPrice.toString() || '')

  const settingsStore = useSettingsStore(state => state)
  useEffect(() => {
    getPriorities().then(ps => settingsStore.setPriorities(ps))
  }, []);

  useEffect(() => {
    setTotalPrice(o?.totalPrice.toString() || '')
    setDeliveryPrice(o?.deliveryPrice.toString() || '')
  }, [o?.id]);

  const [priority, setPriority] = useState<OrderPriorityRead | undefined>()
  useEffect(() => {
    if (settingsStore.priorities) {
      setPriority(settingsStore.priorities.find(p => p.id === o?.priorityId))
    }
  }, [settingsStore.priorities]);

  const onUpdateOrder = async () => {
    const order = await updateOrder({...o!, timeToDelivery: `${o?.timeToDelivery}`, totalPrice: parseFloat(totalPrice), deliveryPrice: parseFloat(deliveryPrice)})
    ordersStore.setOrder(order)
    getOrders().then(orders => ordersStore.setOrders(orders))
  }

  return (<div className={classes.menu}>
    <div className={classes.menuTitle}>Редактирование заказа</div>
    <div className={classes.menuContainer}>
      <div className={classes.name}>ID: {o?.id}</div>
      <div className={classes.name}>Дата создания: {o?.created}</div>
      <div className={classes.name}>
        {o?.curierId ? <div>Курьер: ID {o?.curier.id} - {o?.curier.fullName}  тел. {o?.curier.phoneNumber}</div>
          : <div>Курьер: Не назначен</div>}
      </div>
      <div className={classes.name}>
        Статус:
        <select
          className={classes.select}
          value={o?.status.name}
          onChange={(e) => {
            ordersStore.setOrder({...o!, status: ordersStore.statuses.find(s => s.name === e.currentTarget.value)!, statusId: ordersStore.statuses.find(s => s.name === e.currentTarget.value)!.id})
          }}
        >
          {ordersStore.statuses?.map(s => {
            return (<option key={`order_status#${s.id}`} value={s.name}>{s.name}</option>)
          })}
        </select>
      </div>
      <div className={classes.name}>
        Приоритет: {priority?.name}
      </div>
      <div className={classes.name}>
        Цена корзины заказа: {totalPrice} ₽
      </div>
      <div className={classes.name}>
        Цена доставки: {o?.deliveryPrice} ₽
      </div>
      <div className={classes.name}>
        Примерное время доставки:<br/>
        <input
          value={o?.timeToDelivery || ''}
          onInput={(e) => ordersStore.setOrder({...o!, timeToDelivery: `${e.currentTarget.value}`})}
        />
      </div>
      <div className={classes.name}>
        Адрес доставки:<br/>
        ул. {o?.address.street},
        дом {o?.address.house},
        подъезд {o?.address.entrance},
        квартира {o?.address.flat},
        этаж {o?.address.floor}<br/>
        Комментарий: {o?.address.comment}
      </div>
      <div className={classes.name}>
        Метод оплаты: {o?.paymentMethod}
      </div>
      <div className={classes.name}>Номер телефона пользователя: {`+${o?.user.phoneNumber}`}</div>
      <div
        className={classes.button}
        style={{background: '#1b9f01', color: '#EEEFF9'}}
        onClick={async () => await onUpdateOrder()}
      >
        Применить изменения
      </div>
    </div>
  </div>)


}

export default OrderUpdate