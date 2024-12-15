import {View, Text, ScrollView} from "react-native"
import {useUIStore} from "../../../../stores/useUIStore";
import OrderStatusBar from "./OrderStatusBar";
import OrderStatus from "./OrderStatus";
import React from "react";
import OrderButtons from "./OrderButtons";
import OrderProductsList from "./OrderProductsList";
import OrderMap from "./OrderMap";
import OrderData from "./OrderData";

const OrderView = () => {
  const uiStore = useUIStore(state => state)

  const order = uiStore.viewOrder
  if (!order) return

  return (
    <ScrollView className="p-2 bg-[#EEEFF3] w-full h-full pt-11 flex flex-col">
      <View className="flex items-center mb-2 justify-center p-2 bg-white rounded-2xl">
        <Text className="text-black text-xl">Заказ №{order.id}</Text>
      </View>
      <View className="w-full h-auto flex mb-2 flex-col bg-white rounded-2xl gap-2 p-2">
        <OrderStatusBar order={order}/>
        <OrderStatus order={order}/>
      </View>
      <OrderData order={order} />
      <OrderProductsList order={order} />
      <OrderMap order={order}/>
      <OrderButtons />
      <View className="w-full h-12"></View>
    </ScrollView>
  )
}

export default OrderView