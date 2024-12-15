import {Text, View} from "react-native";
import { useDataStore } from "../../../../stores/useDataStore";
import OrderCard from "./OrderCard";

const OrderList = () => {
  const dataStore = useDataStore(state => state)

  return (
    <View className='h-auto w-full flex flex-col gap-2 mt-4'>
      <Text className="text-black text-xl text-center">Активные заказы</Text>
      {dataStore.orders && dataStore.orders.sort((a, b) => b.id - a.id).length > 0 && dataStore.orders.map(order => {
        if (order.status.id == 0 || order.status.id == 5) return
        return <OrderCard key={order.id} order={order} />
      })
      }
      {dataStore.orders && dataStore.orders.length === 0 &&
        <Text className="text-gray-500 text-xl text-center">Нет активных заказов</Text>
      }
    </View>
  )
}

export default OrderList