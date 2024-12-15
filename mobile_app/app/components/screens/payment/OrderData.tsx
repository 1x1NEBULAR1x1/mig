import {View, Text} from "react-native";
import {useDeliveryPrice} from "../../../../hooks/useDeliveryPrice";
import {useDataStore} from "../../../../stores/useDataStore";
import {useCitiesStore} from "../../../../stores/useCitiesStore";
import {useOrderStore} from "../../../../stores/useOrderStore";
import {useEffect} from "react";
import {useTax} from "../../../../hooks/useTax";
import {usePriorityPrice} from "../../../../hooks/usePriorityPrice";
import {useTotalPrice} from "../../../../hooks/useTotalPrice";

const OrderData = () => {
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

  const priorityPrice = usePriorityPrice(orderStore.orderDeliveryPriority!, cartPrice)

  const totalPrice = useTotalPrice(deliveryPrice, cartPrice, priorityPrice, orderStore.curierTips as 'Без чая' | '5%' | '10%' | '20%')

  useEffect(() => {
    orderStore.setOrder({...orderStore.order!, totalPrice})
  }, [totalPrice])


  return (
    <View className='flex flex-col p-2 gap-2 w-full bg-white rounded-2xl'>
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
      <View className='flex w-full flex-row justify-between'>
        <Text className='text-lg w-auto'>Налог</Text>
        <Text className='text-lg w-auto'>{tax || 0} Руб.</Text>
      </View>
      <View className='w-full h-[1px] bg-gray-300'></View>
      <View className='flex w-full flex-row justify-between'>
        <Text className='text-xl w-auto'>Итого</Text>
        <Text className='text-xl w-auto'>{totalPrice.toFixed(2)} ₽</Text>
      </View>
    </View>
  )
}

export default OrderData