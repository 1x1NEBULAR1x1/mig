import {Pressable, Text} from "react-native";
import {Order} from "../../../../types/models";
import {FC} from "react";
import {useUIStore} from "../../../../stores/useUIStore";
import { useTypedNavigation } from "../../../../hooks/useTypedNavigation";
import OrderCardProducts from "../OrderCardProducts";

interface IOrederCardProps {
  order: Order
}

const OrderCard: FC<IOrederCardProps> = ({order}) => {
  const uiStore = useUIStore(state => state)
  const {navigate} = useTypedNavigation()

  const onPress = () => {
    uiStore.setViewOrder(order)
    navigate('Order')
  }

  return (
    <Pressable
      className="p-2 bg-[#EEEFF3] rounded-2xl w-full mt-2 flex flex-col"
      onPress={onPress}
    >
      <Text className="text-xl color-[#1B9F01]">{order.status.name}</Text>
      <Text className="text-black text-md">Активный заказ</Text>
      <OrderCardProducts order={order} />
    </Pressable>
  )
}

export default OrderCard