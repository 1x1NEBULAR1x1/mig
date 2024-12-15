import MapView, {Marker} from "react-native-maps";
import {Button, Text, TouchableOpacity, View} from "react-native";
import { useUIStore } from "../../../stores/useUIStore";
import {useTypedNavigation} from "../../../hooks/useTypedNavigation";


const Map = () => {
  const uiStore = useUIStore(state => state)
  const {goBack} = useTypedNavigation()
  const order = uiStore.mapOrder
  if (!order) goBack()
  return (
    <View className="w-full h-full">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: order!.address.latitude!,
          longitude: order!.address.longitude!,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        zoomControlEnabled={true}
        zoomEnabled={true}
      >
        <Marker
          coordinate={{
            latitude: order!.address.latitude!,
            longitude: order!.address.longitude!
          }}
        />
      </MapView>
      <TouchableOpacity
          className="w-auto p-4 absolute bottom-2 left-2 right-16 bg-white rounded-2xl"
          onPress={() => goBack()}
      >
        <Text className="text-black text-lg text-center w-auto font-semibold">Вернуться назад</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Map