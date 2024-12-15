import {Text, View} from "react-native";
import {Order} from "../../../../types/models";
import {useDataStore} from "../../../../stores/useDataStore";
import {useOrderPriorities} from "../../../../hooks/useOrderPriorities";


const OrderData = ({order}: {  order: Order }) => {
  if (!order) return

  const productsCount = order.products.reduce((sum, product) => sum + product.amount, 0);
  const dataStore = useDataStore(state => state)
  const cartPrice = order.products.reduce((acc, product) => {
    return acc + (product.amount * product.product.price);
  }, 0);

  const priorities = useOrderPriorities()

  const priority = priorities.data?.find(p => p.id === order.priorityId);

  const priorityPrice = cartPrice * (priority?.extraCost || 0) / 100;

  const totalPrice = cartPrice + order.deliveryPrice + priorityPrice + (order.tax || 0);

  return(
    <View className='w-full p-3 mb-2 bg-white rounded-2xl flex flex-col gap-2'>
      <View className='flex w-full flex-row justify-between'>
        <Text className='text-lg w-auto'>{productsCount} ед. товара</Text>
        <Text className='text-lg w-auto'>{cartPrice} Руб.</Text>
      </View>
      <View className='flex w-full flex-row justify-between'>
        <Text className='text-lg w-auto'>Стоимость доставки</Text>
        <Text className='text-lg w-auto'>{order.deliveryPrice.toFixed(2)} Руб.</Text>
      </View>
      {priority?.extraCost && priority.extraCost > 0 &&
        <View className='flex w-full -mt-3 flex-row justify-between'>
          <Text className='text w-auto text-[#56585F]'>Скорость доставки ({priority.extraCost}%)</Text>
          <Text className='text w-auto text-[#56585F]'>{priorityPrice.toFixed(2)} Руб.</Text>
        </View>
      }
      {order.tax > 0 &&
        <View className='flex w-full flex-row justify-between'>
          <Text className='text-lg w-auto'>Налог</Text>
          <Text className='text-lg w-auto'>{order.tax.toFixed(2) || 0} Руб.</Text>
        </View>
      }
      <View className='w-full h-[1px] bg-gray-300'></View>
      <View className='flex w-full flex-row justify-between'>
        <Text className='text-xl w-auto'>Итого</Text>
        <Text className='text-xl w-auto'>{totalPrice.toFixed(2)} ₽</Text>
      </View>
  </View>)
}

export default OrderData