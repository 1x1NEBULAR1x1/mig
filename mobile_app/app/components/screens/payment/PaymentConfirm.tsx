import {View, Text} from "react-native";
import {useOrderStore} from "../../../../stores/useOrderStore";
import React from "react";
import PaymentConfirmData from "./PaymentConfirmData";
import PaymentConfirmAcceptionButtons from "./PaymentConfirmAcceptionButtons";
import PaymentConfirmWaitingButtons from "./PaymentConfirmWaitingButtons";

const PaymentConfirm = () => {
  const orderStore = useOrderStore(state => state)

  return (
    <View className="flex flex-col justify-center items-center p-2 pt-11 w-full h-full bg-[#EEEFF3]">
      <View className='flex flex-col p-2 gap-2 w-full bg-white rounded-3xl'>
        <Text className="text-black text-center mb-4 text-2xl font-semibold">Оплатите заказ</Text>
        <View className='flex flex-col gap-2'>
          <PaymentConfirmData />
          {!orderStore.isPaymentAcception
            ? <PaymentConfirmAcceptionButtons />
            : <PaymentConfirmWaitingButtons />
          }
        </View>
      </View>
    </View>
  )
}

export default PaymentConfirm