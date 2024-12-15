import {Order} from "../../../../types/models";
import {FC, useState} from "react";
import {Pressable, Text, View} from "react-native";
import OrderProduct from "./OrderProduct";
import Svg, {Path} from "react-native-svg";


interface IOrderProductsList {
  order: Order
}

const OrderProductsList: FC<IOrderProductsList> = ({order}) => {
  const [openList, setOpenList] = useState(true)

  return (
    <View className="w-full h-auto flex flex-col gap-2 bg-white rounded-2xl p-2">
      <View className='flex flex-row items-center justify-between px-4'>
        <Text className="text-black text-lg">Детали заказа</Text>
        <Pressable
          className="w-20 h-10 flex items-end justify-center"
          style={openList ? {} : {transform: 'rotateX(180deg)'}}
          onPress={() => setOpenList(!openList)}
        >
          <Svg width="14" height="14" viewBox="0 0 16 9" fill="none">
            <Path fillRule="evenodd" clipRule="evenodd" d="M7.29297 8.41421L0.292969 1.41421L1.70718 0L8.00008 6.29289L14.293 0L15.7072 1.41421L8.70718 8.41421C8.31666 8.80474 7.68349 8.80474 7.29297 8.41421Z" fill="#1B1C1F"/>
          </Svg>
        </Pressable>
      </View>
      {openList &&
        <View className="w-full h-auto flex flex-col gap-2">
          <View className="w-full h-[1px] bg-gray-200"/>
          <View className="w-full h-auto flex flex-col gap-2">
            {order.products.map((product, index) => (
              <View
                className="w-full h-auto flex flex-col gap-2"
                key={`product-${product.id}-${order.id}-${product.product.id}`}
              >
                <OrderProduct orderProduct={product}/>
                {index !== order.products.length - 1 && <View className="w-full h-[1px] bg-gray-200"/>}
              </View>
            ))}
          </View>
        </View>
      }
    </View>
  )
}

export default OrderProductsList