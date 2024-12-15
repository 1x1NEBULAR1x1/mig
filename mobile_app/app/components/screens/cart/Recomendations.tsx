import {FlatList, Text, View} from "react-native";
import {useUIStore} from "../../../../stores/useUIStore";
import RecomendationProduct from "./RecomendationProduct";

const Recomendations = () => {
  const uiStore = useUIStore(state => state)
  return (
    <View className="w-fit h-auto">
      <Text className="text-lg p-2 text-center mb-2 rounded-2xl bg-white">
        Рекомендованные продукты
      </Text>
      <FlatList
        className="w-auto h-96"
        horizontal
        keyExtractor={(item) => `recomendation-${item.id}`}
        data={uiStore.recomendations}
        renderItem={({item}) => <RecomendationProduct product={item} />}
      />
    </View>
  )
}

export default Recomendations