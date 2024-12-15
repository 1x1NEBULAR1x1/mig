import {View, Text, Image, Pressable} from "react-native"
import {CartProduct as CartProductType} from "../../../../types/models";
import {FC} from "react";
import Svg, {Path} from "react-native-svg";
import {useDataStore} from "../../../../stores/useDataStore";
import {url} from "../../../../requests/load_data";

interface ICartProduct {
  cartProduct: CartProductType
}

const CartProduct: FC<ICartProduct> = ({cartProduct}) => {

  const dataStore = useDataStore(state => state)

  const updateProductAmount = (product: CartProductType, amount: number) => {
    const cartProduct = dataStore.cart.find(cartProduct => cartProduct.product === product.product)
    if (!cartProduct) return
    dataStore.updateCartProduct({...cartProduct, amount: cartProduct.amount + amount})
  }

  return (
    <View className="flex w-full aspect-[3/1] flex-row p-2">
      <View className='flex flex-col items-center justify-center h-full aspect-square'>
        <Image
          source={{uri: `${url}${cartProduct.product.imagePath}`}}
          className='object-cover w-full h-full'
          resizeMode='contain'
        />
      </View>
      <View className="flex-1 flex flex-col gap-1">
        <View className="flex flex-row items-start justify-between p-1">
          <Text numberOfLines={2} className="text-black text-md">{cartProduct.product.name}</Text>
          <Pressable
            className='flex items-center'
            onPress={() => dataStore.updateCartProduct({...cartProduct, amount: 0})}
          >
            <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <Path
                d="M5.99943 6.94224L10.1947 11.1375L11.1375 10.1947L6.94224 5.99943L11.1375 1.8042L10.1947 0.86139L5.99943 5.05662L1.80414 0.861328L0.861328 1.80414L5.05662 5.99943L0.861328 10.1947L1.80414 11.1375L5.99943 6.94224Z"
                fill="#56585F"/>
            </Svg>
          </Pressable>
        </View>
        <View className="flex flex-row items-center justify-between">
          <View className='flex flex-col h-auto justify-center'>
            {cartProduct.product.previousPrice && (<Text
              className='text-gray-500 text-xs line-through mb-[-10px]'>{cartProduct.product.previousPrice + ' ₽'}</Text>)}
            <Text className='text-black text-lg'>{cartProduct.product.price + ' ₽'}</Text>
          </View>
          <View className='w-[45%] h-10 flex flex-row py-2 px-1 bg-[#1B9F01] rounded-full items-center justify-between'>
            <Pressable
              className='flex items-center justify-center w-12 h-8'
              onPress={() => updateProductAmount(cartProduct, -1)}
            >
              <Svg width="18" height="18" viewBox="0 0 14 2" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd"
                  d="M13.6673 1.83268H0.333984V0.166016H13.6673V1.83268Z"
                  fill="#EEEFF3"/>
              </Svg>
            </Pressable>
            <Text className='text-white h-10 font-semibold text-lg'>{cartProduct.amount}</Text>
            <Pressable
              className='flex items-center justify-center w-12 h-8'
              onPress={() => updateProductAmount(cartProduct, 1)}
            >
              <Svg width="18" height="18" viewBox="0 0 15 16" fill="none">
                <Path d="M8.33333 0.5H6.66667V7.16667H0V8.83333H6.66667V15.5H8.33333V8.83333H15V7.16667H8.33333V0.5Z" fill="#EEEFF3"/>
              </Svg>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CartProduct