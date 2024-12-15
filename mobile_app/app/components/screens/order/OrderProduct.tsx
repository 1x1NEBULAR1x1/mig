import {View, Text, Image, Pressable} from "react-native"
import {OrderProduct} from "../../../../types/models";
import {FC} from "react";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {useUIStore} from "../../../../stores/useUIStore";
import {url} from "../../../../requests/load_data";

interface ICartProduct {
  orderProduct: OrderProduct
}

const CartProduct: FC<ICartProduct> = ({orderProduct}) => {
  const {navigate} = useTypedNavigation()
  const uiStore = useUIStore(state => state)

  return (
    <View className="flex w-full aspect-[3/1] flex-row p-2">
      <Pressable
        className='flex flex-col items-center justify-center h-full aspect-square'
        onPress={() => {
          uiStore.setViewProduct(orderProduct.product)
          navigate('ProductScreen')
        }}
      >
        <Image
          source={{uri: `${url}${orderProduct.product.imagePath}`}}
          className='object-cover w-full h-full'
          resizeMode='contain'
        />
      </Pressable>
      <View className="flex-1 flex flex-col justify-between">
        <Text className="text-black" numberOfLines={3}>{orderProduct.product.name}</Text>
        <View className="flex flex-row items-center justify-between">
          <View className='flex flex-col h-auto justify-center'>
            {orderProduct.product.previousPrice && (<Text
              className='text-gray-500 text-xs line-through mb-[-10px]'>{orderProduct.product.previousPrice + ' ₽'}</Text>)}
            <Text className='text-black text-lg'>{orderProduct.product.price + ' ₽'}</Text>
          </View>
          <Text className="text-black text-lg">{orderProduct.amount} ед.</Text>
        </View>
      </View>
    </View>
  )
}

export default CartProduct