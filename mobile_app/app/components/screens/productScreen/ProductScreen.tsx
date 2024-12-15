import {useUIStore} from "../../../../stores/useUIStore";
import {View, Text, Pressable, Image, ScrollView} from "react-native";
import {Product} from "../../../../types/models";
import {useDataStore} from "../../../../stores/useDataStore";
import Svg, {Path} from "react-native-svg";
import {url} from "../../../../requests/load_data";

const ProductScreen = () => {
  const uiStore = useUIStore(state => state)
  const dataStore = useDataStore(state => state)
  const product = uiStore.viewProduct

  const onAddToCart = (product: Product) => {
    dataStore.addToCart({product: product, amount: 1})
  }

  const updateProductAmount = (product: Product, amount: number) => {
    const cartProduct = dataStore.cart.find(cartProduct => cartProduct.product.id === product.id)
    if (!cartProduct) return
    dataStore.updateCartProduct({...cartProduct, amount: cartProduct.amount + amount})
  }

  if (!product) return
  const amount = dataStore.cart.find(cartProduct => cartProduct.product.id === product.id)?.amount || 0

  return (
    <ScrollView className="w-full h-auto bg-[#EEEFF3]">
      <View
        className="w-full h-full bg-[#EEEFF3] flex flex-col p-4 pt-12"
      >
        {product
          ? <View className="w-full h-full flex flex-col p-4 bg-white rounded-3xl gap-2">
            <View className='flex flex-row gap-4 w-full'>
              {product.tags?.map(tag => (
                <View
                  key={`tag-${tag.id}-${product.id}-${tag.name}`}
                  className={`bg-[${tag.firstColor}] rounded-full p-1 px-4`}
                >
                  <Text className={`text-[${tag.secondColor}] text-lg text-center`}>{tag.name}</Text>
                </View>
              ))}
            </View>
            <View className='flex flex-col items-center justify-center w-full'>
              <View className='flex flex-col items-center justify-center w-[75%] aspect-square'>
                <Image
                  source={{uri: `${url}${product.imagePath}`}}
                  className='object-cover w-full h-full'
                  resizeMode='contain'
                />
              </View>
            </View>
            <View className="flex flex-col gap-1">
            <Text className="text-black text-xl font-normal">{product.name}</Text>
            <Text className="text-gray-700 text-md">{product.amount + ' ' + product.unitsOfMeasure}</Text></View>
            <View className="flex flex-row justify-between items-center text-center w-full bg-[#EEEFF3] p-2 rounded-2xl">
              <View className='flex flex-col h-auto justify-center'>
                {product.previousPrice && (<Text className='text-gray-500 text-md line-through mb-[-10px]'>{product.previousPrice + ' ₽'}</Text>)}
                <Text className='text-black text-2xl'>{product.price + ' ₽'}</Text>
              </View>
              {!amount
                ? <Pressable
                    onPress={() => onAddToCart(product)}
                    className='flex flex-row p-2 w-[45%] px-8 gap-8 bg-[#1B9F01] rounded-full items-center justify-center'
                  >
                    <Text className='text-white font-semibold text-lg text-center w-full'>Купить</Text>
                  </Pressable>
                : <View className='w-[45%] flex flex-row py-2 px-1 bg-[#1B9F01] rounded-full items-center justify-between'>
                  <Pressable
                    className='flex items-center justify-center w-12 h-8'
                    onPress={() => updateProductAmount(product, -1)}
                  >
                    <Svg width="18" height="18" viewBox="0 0 14 2" fill="none">
                      <Path fillRule="evenodd" clipRule="evenodd"
                            d="M13.6673 1.83268H0.333984V0.166016H13.6673V1.83268Z"
                            fill="#EEEFF3"/>
                    </Svg>
                  </Pressable>
                  <Text className='text-white font-semibold text-lg'>{amount}</Text>
                  <Pressable
                    className='flex items-center justify-center w-12 h-8'
                    onPress={() => updateProductAmount(product, 1)}
                  >
                    <Svg width="18" height="18" viewBox="0 0 15 16" fill="none">
                      <Path
                        d="M8.33333 0.5H6.66667V7.16667H0V8.83333H6.66667V15.5H8.33333V8.83333H15V7.16667H8.33333V0.5Z"
                        fill="#EEEFF3"/>
                    </Svg>
                  </Pressable>
                </View>
              }
            </View>
            <Text className="text-black text-md font-normal">{product.description}</Text>
            <View className="flex flex-col gap-1">
              {product.contains && product.contains.length > 0 && <Text className='text-gray-500 text-md'>В 100 граммах: </Text>}
              <View className="flex flex-row gap-4">
                {product.contains?.map(contain => (
                  <View key={`contain-${contain.id}-${product.id}-${contain.name}`} className="flex flex-col h-auto p-0">
                    <Text className="text-black text-xl">{contain.amount}</Text>
                    <Text className="text-gray-700 text-md">{contain.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            {product.compound && <View>
              <Text className="text-gray-500 text-sm font-normal">Состав</Text>
              <Text className="text-black text-md font-normal">{product.compound}</Text>
            </View>}
            {product.manufacturer && <View>
              <Text className="text-gray-500 text-sm font-normal">Производитель</Text>
              <Text className="text-black text-md font-normal">{product.manufacturer}</Text>
            </View>}
            {product.storage && <View>
              <Text className="text-gray-500 text-sm font-normal">Условия хранения</Text>
              <Text className="text-black text-md font-normal">{product.storage}</Text>
            </View>}
            {product.manufacturer && <View>
              <Text className="text-gray-500 text-sm font-normal">Производитель</Text>
              <Text className="text-black text-md font-normal">{product.manufacturer}</Text>
            </View>}
          </View>
          : <View className="w-full h-full flex flex-col p-4 bg-white rounded-3xl">
            <Text className="text-black text-3xl">Загрузка...</Text>
          </View>}
      </View>
    </ScrollView>
  )
}

export default ProductScreen