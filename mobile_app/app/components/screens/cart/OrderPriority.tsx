import { Picker } from "@react-native-picker/picker";
import {Text, View} from "react-native";
import {useOrderStore} from "../../../../stores/useOrderStore";
import {useDataStore} from "../../../../stores/useDataStore";
import {useOrderPriorities} from "../../../../hooks/useOrderPriorities";
import {useEffect} from "react";

const OrderPriority = () => {

  const orderStore = useOrderStore(state => state)

  const dataStore = useDataStore(state => state)

  const {data, isLoading, isSuccess} = useOrderPriorities()

  useEffect(() => {if (data && isLoading && isSuccess) dataStore.setOrderPriorities(data)}, [data, isLoading, isSuccess])

  useEffect(() => {
    if (!orderStore.orderDeliveryPriority && Array.isArray(dataStore.orderPriorities) && dataStore.orderPriorities.length > 0) {
      const priorityWithMinCost = dataStore.orderPriorities.reduce((minPriority, currentPriority) => {
        return currentPriority.extraCost < minPriority.extraCost ? currentPriority : minPriority;
      });
      orderStore.setOrderDeliveryPriority(priorityWithMinCost);
    }
  }, [orderStore.orderDeliveryPriority, dataStore.orderPriorities]);

  return (
    <View className='flex flex-col w-full border-gray-300 border rounded-2xl'>
      <Text className="text-[#A9A9A9] mt-3 ml-3 h-7.5 w-[25%]">Приоритет</Text>
      <Picker
        style={{width: '100%', color: '#1B1C1F', padding: 0, margin: 0, marginLeft: '-1.5%'}}
        selectedValue={orderStore.orderDeliveryPriority}
        onValueChange={(itemValue) => orderStore.setOrderDeliveryPriority(itemValue)}
      >
        {dataStore.orderPriorities.map((priority) => (
          <Picker.Item style={{fontSize: 14, color: '#A9A9A9'}} value={priority} label={priority.name} key={`priority-${priority.name}`}/>
        ))}
      </Picker>

    </View>
  )
}

export default OrderPriority