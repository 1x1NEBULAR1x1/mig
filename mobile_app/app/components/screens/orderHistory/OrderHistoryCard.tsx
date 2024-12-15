import {Pressable, Text, View} from "react-native";
import {Order} from "../../../../types/models";
import {FC} from "react";
import OrderCardProducts from "../OrderCardProducts";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {useUIStore} from "../../../../stores/useUIStore";

interface IOrderHistoryCard{
  order: Order
  active?: boolean
  selected?: boolean
}

const OrderHistoryCard: FC<IOrderHistoryCard> = ({order, active, selected}) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  };

  let finishedDate = undefined;

  if (order.finished) {
    finishedDate = new Date(order.finished);
  }

  const formattedDate = finishedDate?.toLocaleString('ru-RU', options);

  const {navigate} = useTypedNavigation()
  const {setViewOrderHistory} = useUIStore(state => state)

  const onPress = () => {
    setViewOrderHistory(order)
    navigate('OrderHistoryView')
  }

  return (
    <Pressable
      className={`w-full h-auto flex flex-col p-2 px-4 mb-2 bg-[#EEEFF3] rounded-2xl gap-2 border ${selected ? 'border-[#1B9F01]' : 'border-[#EEEFF3]'}`}
      onPress={onPress}
    >
      {active
        ? <View className="w-full h-auto flex flex-row justify-between">
          <View className="w-auto h-auto flex flex-col">
            <Text className="text-lg text-[#1B9F01]">{order.status.name}</Text>
            <Text className="text-black">Активный заказ</Text>
          </View>
          <View className="w-auto h-auto flex items-end flex-col">
            <Text className="text-black text-lg text-right">{order.totalPrice.toFixed(2)} ₽</Text>
          </View>
        </View>
        : <View className="w-full h-auto flex flex-row justify-between">
          <View className="w-auto h-auto flex flex-col">
            {formattedDate && <Text className="w-auto text-xl text-black">{formattedDate}</Text>}
          </View>
          <View className="w-auto h-auto flex flex-col">
            <Text className="w-auto text-lg text-black">{order.totalPrice.toFixed(2)} ₽</Text>
            <Text className={`w-auto text-[${order.status.id === 1 ? '#1B9F01' : '#EC4646'}]`}>{order.status.name}</Text>
          </View>
        </View>
      }
      <OrderCardProducts order={order} />
    </Pressable>
  )
}

export default OrderHistoryCard