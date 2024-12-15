import {Text, View} from "react-native";
import { useCitiesStore } from "../../../../stores/useCitiesStore";

const CartEmptyMessage = () => {

  const citiesStore = useCitiesStore(state => state)

  return (
      <View className="flex flex-сol gap-2 h-[30vh] p-4 w-full items-center justify-evenly bg-white rounded-2xl">
        <Text className="text-black text-2xl w-full text-center">Корзина пуста</Text>
        <Text className="text-black text-lg w-full text-center">
          {citiesStore.selectedCity
            ? 'Вы можете перейти в каталог, чтобы выбрать продукты'
            : 'Выберите свой город и перейдите в каталог, чтобы выбрать продукты'}
        </Text>
      </View>
  )
}

export default CartEmptyMessage