import {Text, View} from "react-native";
import {useDataStore} from "../../../../stores/useDataStore";
import {useTax} from "../../../../hooks/useTax";
import {useDeliveryPrice} from "../../../../hooks/useDeliveryPrice";
import {useCitiesStore} from "../../../../stores/useCitiesStore";
import { useOrderStore } from "../../../../stores/useOrderStore";
import {usePriorityPrice} from "../../../../hooks/usePriorityPrice";
import {useTotalPrice} from "../../../../hooks/useTotalPrice";
import React from "react";

const OrderDetails = () => {
  const dataStore = useDataStore(state => state)
  const citiesStore = useCitiesStore(state => state)
  const orderStore = useOrderStore(state => state)
  const {data: tax} = useTax()
  const {deliveryPrice} = useDeliveryPrice({
    cityName: citiesStore.selectedCity?.name || '',
    street: orderStore.orderStreet,
    house: orderStore.orderHouse
  })
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
          tips = parseFloat((price * 0.05).toFixed(2))
          break;
        case '20%':
          tips = parseFloat((price * 0.05).toFixed(2))
          break;
        default:
          tips = 0
          break;
      }
    }
  }
  const priorityPrice = usePriorityPrice(orderStore.orderDeliveryPriority, cartPrice)

  const totalPrice = useTotalPrice(deliveryPrice, cartPrice, priorityPrice, orderStore.curierTips as 'Без чая' | '5%' | '10%' | '20%')

  return(<>
    <View className='flex w-full flex-row justify-between'>
        <Text className='text-lg w-auto'>{dataStore.cart.length} ед. товара</Text>
        <Text className='text-lg w-auto'>{cartPrice} Руб.</Text>
      </View>
      <View className='flex w-full flex-row justify-between'>
        <Text className='text-lg w-auto'>Стоимость доставки</Text>
        <Text className='text-lg w-auto'>{deliveryPrice?.toFixed(2)} Руб.</Text>
      </View>
      {priorityPrice > 0 &&
        <View className='flex w-full -mt-3 flex-row justify-between'>
          <Text className='text w-auto text-[#56585F]'>Скорость доставки ({orderStore.orderDeliveryPriority?.extraCost}%)</Text>
          <Text className='text w-auto text-[#56585F]'>{priorityPrice.toFixed(2)} Руб.</Text>
        </View>
      }
      {tax && tax > 0 && <View className='flex w-full flex-row justify-between'>
        <Text className='text-lg w-auto'>Налог</Text>
        <Text className='text-lg w-auto'>{tax || 0} Руб.</Text>
      </View>}
      <View className='w-full h-[1px] bg-gray-300'></View>
      <View className='flex w-full flex-row justify-between'>
        <Text className='text-xl w-auto'>Итого</Text>
        <Text className='text-xl w-auto'>{totalPrice} ₽</Text>
      </View>
  </>)
}

export default OrderDetails