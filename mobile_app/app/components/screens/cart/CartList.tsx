import {FlatList, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import CartProduct from "./CartProduct";
import React from "react";
import {useDataStore} from "../../../../stores/useDataStore";
import OrderDetails from "./OrderDetails";


const CartList = () => {

  const dataStore = useDataStore(state => state)

  return (
    <View className='flex flex-col h-max w-full bg-white gap-2 rounded-2xl mb-2'>
      <Text className='text-2xl m-2.5 text-center'>Детали заказа</Text>
      <View className='h-[1px] w-full bg-gray-300'/>
      <FlatList
        scrollEnabled={false}
        data={dataStore.cart}
        className='flex flex-col h-max mb-2 gap-2 w-full bg-white rounded-2xl'
        renderItem={({item, index}) => (
          <View key={`cart-product-${item.product.id}`}>
            <CartProduct cartProduct={item}  />
            {index < dataStore.cart.length - 1 && <View className='h-[1px] w-full bg-gray-300'/>}
          </View>
        )}
      />
    </View>
  )
}

export default CartList