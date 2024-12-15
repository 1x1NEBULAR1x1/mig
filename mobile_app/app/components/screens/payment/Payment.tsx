import {View, Text, Pressable} from "react-native";
import {OrderCreate} from "../../../../types/models";
import {useOrderStore} from "../../../../stores/useOrderStore";
import {useCitiesStore} from "../../../../stores/useCitiesStore";
import {useDataStore} from "../../../../stores/useDataStore";
import {useDeliveryPrice} from "../../../../hooks/useDeliveryPrice";
import PaymentMethod from "./PaymentMethod";
import PaymentTips from "./PaymentTips";
import OrderData from "./OrderData";
import RegisterMenu from "../profile/RegisterMenu";
import React, {useEffect} from "react";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {useTax} from "../../../../hooks/useTax";
import {usePriorityPrice} from "../../../../hooks/usePriorityPrice";
import {useTotalPrice} from "../../../../hooks/useTotalPrice";

const Payment = () => {
  const orderStore = useOrderStore(state => state)
  const {navigate} = useTypedNavigation()
  const citiesStore = useCitiesStore(state => state)
  const dataStore = useDataStore(state => state)
  const {deliveryPrice} = useDeliveryPrice({
    cityName: citiesStore.selectedCity?.name || '',
    street: orderStore.orderStreet,
    house: orderStore.orderHouse
  })
  const {data: tax} = useTax()
  const cartPrice = dataStore.cart.reduce((total, cartItem) => {
    return total + cartItem.amount * cartItem.product.price
  }, 0);

  let tips = 0

  if (orderStore.curierTips) {
    if (orderStore.curierTips !== 'Без чая') {
      const price = dataStore.cart.reduce((total, cartItem) => {
        return total + cartItem.amount * cartItem.product.price
      }, 0);
      switch (orderStore.curierTips) {
        case '5%':
          tips = parseFloat((price * 0.05).toFixed(2))
          break;
        case '10%':
          tips = parseFloat((price * 0.1).toFixed(2))
          break;
        case '20%':
          tips = parseFloat((price * 0.2).toFixed(2))
          break;
        default:
          tips = 0
          break;
      }
    }
  }
  const priorityPrice = usePriorityPrice(orderStore.orderDeliveryPriority!, cartPrice)

  const totalPrice = useTotalPrice(deliveryPrice, cartPrice, priorityPrice, orderStore.curierTips as 'Без чая' | '5%' | '10%' | '20%')

  useEffect(() => {
    orderStore.setOrderTotalPrice(totalPrice)
  }, [totalPrice]);

  const onSubmit = () => {
    const order: OrderCreate = {
      address: {
        cityId: citiesStore.selectedCity?.id || -1,
        street: orderStore.orderStreet,
        house: orderStore.orderHouse,
        floor: orderStore.orderFloor,
        flat: orderStore.orderFlat,
        entrance: orderStore.orderEntrance,
        comment: orderStore.orderComment,
        latitude: orderStore.latitude,
        longitude: orderStore.longtude,
      },
      totalPrice: orderStore.orderTotalPrice,
      products: dataStore.cart,
      deliveryPrice: deliveryPrice || 0,
      paymentMethod: orderStore.paymentMethod,
      curierTips: parseFloat(tips.toFixed(2)),
      priority: orderStore.orderDeliveryPriority!
    };
    if (order) {
      orderStore.setOrderTotalPrice(orderStore.order!.totalPrice!)
      orderStore.setOrder(order)
      navigate('PaymentConfirm')
    }
  }


  return (
    <View className="flex flex-col justify-center items-center p-2 pt-11 align-center mb-2 w-full h-full bg-[#EEEFF3]">
      <View className='flex flex-col p-2 gap-2 w-full bg-white rounded-2xl'>
        {!dataStore.user &&
          <>
            <RegisterMenu />
            <View className='w-full h-[1px] bg-gray-300'></View>
          </>
        }
        <Text className='m-1 w-full text-center text-2xl p-2 text-gray-800 text-balance'>Выберите способ оплаты</Text>
        <PaymentMethod />
        <Text className='text-lg ml-2'>Чаевые курьеру</Text>
        <PaymentTips />
        <View className='w-full h-[1px] bg-gray-300'></View>
        <OrderData />
        <Pressable
          disabled={!dataStore.user}
          onPress={onSubmit}
          className={`flex flex-row p-2 m-2 w-full transition-colors duration-300 items-center justify-evenly mb-2 bg-[#${dataStore.user ? '1B9F01' : 'EEEFF3'}] rounded-full`}
        >
          <Text className={`text-white text-2xl`}>Оформить заказ</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Payment