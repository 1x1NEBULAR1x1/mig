import {Text, TouchableOpacity, View} from "react-native";
import {Order} from "../../../../types/models";
import {FC} from "react";
import MapView, {Marker} from 'react-native-maps';
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {useUIStore} from "../../../../stores/useUIStore";





interface IOrderMap {
  order: Order
}

const OrderMap: FC<IOrderMap> = ({order}) => {
  if (!order.address.latitude || !order.address.longitude) return (<View />)
  const {navigate} = useTypedNavigation()
  const uiStore = useUIStore(state => state)

  return (
    <View className="w-full h-[50vh] rounded-2xl">
      <TouchableOpacity
        onPress={() => {
          uiStore.setMapOrder(order)
          navigate('Map')
        }}
        className="w-full p-4 mt-2 bg-white rounded-2xl"
      >
        <Text className="text-black text-lg text-center font-semibold">Показать на карте</Text>
      </TouchableOpacity>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: order.address.latitude,
          longitude: order.address.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}

        zoomControlEnabled={true}
        zoomEnabled={true}
      >
        <Marker
          coordinate={{
            latitude: order.address.latitude,
            longitude: order.address.longitude
          }}
        />
      </MapView>
    </View>
  )
}

export default OrderMap