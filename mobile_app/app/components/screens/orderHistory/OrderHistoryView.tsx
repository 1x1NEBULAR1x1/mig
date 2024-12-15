import {View, Text, ScrollView} from "react-native";
import OrderStatusBar from "../order/OrderStatusBar";
import OrderStatus from "../order/OrderStatus";
import OrderProductsList from "../order/OrderProductsList";
import OrderMap from "../order/OrderMap";
import OrderButtons from "../order/OrderButtons";
import React from "react";
import {useUIStore} from "../../../../stores/useUIStore";
import OrderData from "../order/OrderData";

const OrderHistoryView = () => {
  const {viewOrderHistory} = useUIStore(state => state)

  if (!viewOrderHistory) return

  return (
    <ScrollView className="p-2 bg-[#EEEFF3] w-full h-auto pt-11 flex flex-col">
      <View className="flex items-center mb-2 justify-center p-2 bg-white rounded-2xl">
        <Text className="text-black text-xl">Заказ №{viewOrderHistory.id}</Text>
      </View>
      {viewOrderHistory.status.id > 1 && viewOrderHistory.status.id < 5 &&
        <View className="w-full h-auto flex mb-2 flex-col bg-white rounded-2xl gap-2 p-2">
          <OrderStatusBar order={viewOrderHistory}/>
          <OrderStatus order={viewOrderHistory}/>
        </View>
      }
      <OrderData order={viewOrderHistory} />
      <OrderProductsList order={viewOrderHistory} />
      <OrderMap order={viewOrderHistory}/>
      <OrderButtons />
      <View className="w-full h-12"></View>
    </ScrollView>
  )
}

export default OrderHistoryView