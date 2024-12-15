import {Product as ProductType} from "../../../../types/models";
import {FC} from "react";
import {View, Text, Image, Pressable, TouchableOpacity} from "react-native";
import {useUIStore} from "../../../../stores/useUIStore";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import Svg, {Path} from "react-native-svg";
import {useDataStore} from "../../../../stores/useDataStore";
import {url} from "../../../../requests/load_data";

interface IProduct {
  product: ProductType
  className?: string
}

const Product: FC<IProduct> = ({product, className}) => {
  const uiStore = useUIStore(state => state)
  const {navigate} = useTypedNavigation()
  const dataStore = useDataStore(state => state)
  if (!product) return
  const amount = dataStore.cart.find(cartProduct => cartProduct.product.id === product.id)?.amount || 0

  const onPressProduct = (product: ProductType) => {
    uiStore.setViewProduct(product)
    navigate('ProductScreen')
  }

  const onAddToCart = (product: ProductType) => {
    dataStore.addToCart({product: product, amount: 1})
  }

  const updateProductAmount = (product: ProductType, amount: number) => {
    const cartProduct = dataStore.cart.find(cartProduct => cartProduct.product.id === product.id)
    if (!cartProduct) return
    dataStore.updateCartProduct({...cartProduct, amount: cartProduct.amount + amount})
  }
  return (
    <TouchableOpacity
      className={className + ' w-auto h-auto aspect-[8/17] mr-2 bg-white p-4 rounded-3xl flex-col gap-1 justify-evenly'}
      onPress={() => onPressProduct(product)}
    >
      <View className='flex flex-row gap-2 w-full overflow-hidden'>
        {product.tags?.map(tag => (
          <View
            key={`tag-${tag.id}-${product.id}-${tag.name}`}
            className={`bg-[${tag.firstColor}] rounded-2xl p-1 px-2`}
          >
            <Text className={`text-[${tag.secondColor}] text-xs text-center`}>{tag.name}</Text>
          </View>
        ))}
      </View>
      <View className='flex flex-col items-center justify-center w-full aspect-square'>
        <Image
          source={{uri: `${url}${product.imagePath}`}}
          className='object-cover w-full h-full'
          resizeMode='contain'
        />
      </View>
      <Text className='text-black text-sm' numberOfLines={2}>{product.name}</Text>
      <Text className='text-gray-700 text-sm'>{product.amount + ' ' + product.unitsOfMeasure}</Text>
      <View className='flex flex-col h-8'>
        {product.previousPrice && (<Text className='text-gray-500 text-xs line-through mb-[-10px]'>{product.previousPrice + ' ₽'}</Text>)}
        <Text className='text-black text-lg'>{product.price + ' ₽'}</Text>
      </View>
      <View className="flex p-1">
        {!amount
          ? <Pressable
            onPress={() => onAddToCart(product)}
            className='flex flex-row w-full items-center h-10 justify-center p-2 bg-[#EEEFF3] rounded-full'
          >
            <Text className='text-black h-7 font-semibold text-sm text-center='>Купить</Text>
        </Pressable>
          : <View className='flex flex-row w-full h-10 px-2 bg-[#1B9F01] rounded-full justify-between items-center'>
            <Pressable
              onPress={() => updateProductAmount(product, -1)}
              className='flex items-center justify-center w-12 h-10'
            >
              <Svg width="14" height="14" viewBox="0 0 14 2" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd"
                  d="M13.6673 1.83268H0.333984V0.166016H13.6673V1.83268Z" fill="#EEEFF3"/>
              </Svg>
            </Pressable>
            <Text className='text-white font-semibold text-sm'>{amount}</Text>
            <Pressable
              className='flex items-center justify-center w-12 h-10'
              onPress={() => updateProductAmount(product, 1)}
            >
              <Svg width="14" height="14" viewBox="0 0 15 16" fill="none">
                <Path d="M8.33333 0.5H6.66667V7.16667H0V8.83333H6.66667V15.5H8.33333V8.83333H15V7.16667H8.33333V0.5Z" fill="#EEEFF3"/>
              </Svg>
            </Pressable>
          </View>
        }
      </View>
    </TouchableOpacity>
  )
}

export default Product