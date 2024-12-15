import {Image, Text, View} from "react-native";
import {Order} from "../../../types/models";
import {FC} from "react";
import {url} from "../../../requests/load_data";

interface IOrderCardProducts{
  order: Order
}

const OrderCardProducts: FC<IOrderCardProducts> = ({order}) => {
  return (
    <View className="w-full h-auto flex flex-row mt-6 gap-2">
      {order.products.slice(0, 4).map(product => {
        return (
          <View
            key={`product-${product.id}-${order.id}-${product.product.id}`}
            className="h-16 aspect-square rounded-xl bg-white"
          >
            <Image
              source={{uri: url + product.product.imagePath}}
              resizeMode='contain'
              className="w-full h-full rounded-xl"
            />
          </View>
        )})}
        {order.products.length > 4 &&
          <View className="h-16 aspect-square rounded-xl bg-white flex items-center justify-center">
            <Text className="text-center text-xl text-[#1B1C1F]">+{order.products.length - 4}</Text>
          </View>
        }
    </View>
  )
}

export default OrderCardProducts