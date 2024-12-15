import {View, Text, ScrollView} from "react-native";
import OrderHistoryList from "./OrderHistoryList";
import {useDataStore} from "../../../../stores/useDataStore";

const OrderHistory = () => {
  const {orders} = useDataStore()

  return (
    <View className="w-full h-full bg-[#EEEFF3] p-2 pt-11">
      <View className="w-full h-auto flex flex-col p-2 mb-2 bg-white rounded-2xl gap-2">
        <Text className="text-lg text-center">История заказов</Text>
      </View>
      <ScrollView className="w-full h-auto flex flex-col p-2 pb-0 bg-white rounded-2xl gap-2">
        <OrderHistoryList orders={orders} />
      </ScrollView>
    </View>
  )
}

export default OrderHistory