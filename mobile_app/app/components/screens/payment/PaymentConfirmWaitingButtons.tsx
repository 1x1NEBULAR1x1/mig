import {Text, TouchableOpacity, View} from "react-native";
import {onSupportChat, onSupportPhone} from "../../../../functions/support";
import React from "react";


const PaymentConfirmWaitingButtons = () => {
  return(<>
  <Text className='bg-[#EEEFF3] rounded-full p-4 px-6 flex items-center justify-center text-center text-[#A0A0A0]'>
    Проверяем поступление средств
  </Text>
    <View className='flex w-full h-auto flex-row gap-4'>
      <TouchableOpacity
        className='flex flex-1 rounded-full bg-black p-4'
        onPress={() => onSupportPhone()}
      >
        <Text className='text-white text-xs text-center w-auto'>Телефон поддержки</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className='flex flex-1 rounded-full bg-[#EEEFF3] p-4'
        onPress={() => onSupportChat()}
      >
        <Text className='text-black text-xs text-center w-auto'>Чат с поддержкой</Text>
      </TouchableOpacity>
    </View>
  </>)
}

export default PaymentConfirmWaitingButtons