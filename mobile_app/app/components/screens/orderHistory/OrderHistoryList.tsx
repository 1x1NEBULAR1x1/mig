import {FlatList, View} from "react-native";
import {FC} from "react";
import { Order } from "../../../../types/models";
import OrderHistoryCard from "./OrderHistoryCard";

interface IOrderHistoryList{
  orders: Order[]
}

const OrderHistoryList: FC<IOrderHistoryList> = ({orders}) => {
  const { finishedOrders, activeOrders } = orders.reduce(
    (result, order) => {
      if (order.status.id === 0 || order.status.id === 5) {
        result.finishedOrders.push(order);
      } else {
        result.activeOrders.push(order);
      }
      return result;
    },
    { finishedOrders: [] as Order[], activeOrders: [] as Order[] }
  );
  finishedOrders.sort((a, b) => b.id - a.id);
  activeOrders.sort((a, b) => b.id - a.id);

  return (
    <View className='h-auto p-2'>
      {activeOrders.map(order => (<OrderHistoryCard key={`active-order-${order.id}`} order={order} active/>))}
      <View className='bg-gray-300 h-[1px] w-full mb-2'></View>
      {finishedOrders.map(order => (<OrderHistoryCard key={`order-${order.id}`} order={order} />))}
    </View>
  )
}

export default OrderHistoryList