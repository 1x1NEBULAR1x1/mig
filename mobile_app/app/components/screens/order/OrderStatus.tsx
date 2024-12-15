import {Order} from "../../../../types/models";
import React, {FC} from "react";
import {Text} from "react-native";

interface IOrderStatus {
  order: Order

}

const OrderStatus: FC<IOrderStatus> = ({order}) => {
  return (
    <>
      <Text className="text-black text-center text-xl font-semibold">{order.status.fullStatus}</Text>
      <Text className="text-black text-center text-md">{order.status.description} {order.timeToDelivery}</Text>
    </>
  )
}

export default OrderStatus