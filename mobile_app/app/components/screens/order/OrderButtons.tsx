import {Pressable, Text, View} from "react-native"
import {onSupportChat, onSupportPhone} from "../../../../functions/support";

const OrderButtons = () => {

  return (
    <View className="w-full flex h-auto bg-white rounded-2xl p-2 mt-2 mb-1 flex-row gap-2">
      <Pressable
        className='flex-1 p-2 flex items-center justify-center bg-black rounded-full'
        onPress={onSupportChat}
      >
        <Text className="text-white text-sm">Телефон поддержки</Text>
      </Pressable>
      <Pressable
        className='flex-1 p-2 flex items-center justify-center bg-[#EEEFF3] rounded-full'
        onPress={onSupportPhone}
      >
        <Text className="text-black text-sm">Чат с поддержкой</Text>
      </Pressable>
    </View>
  )
}

export default OrderButtons