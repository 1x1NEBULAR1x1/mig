import {Pressable, View, Text} from "react-native";
import {onSupportChat, onSupportPhone} from "../../../../functions/support";


const SupportButtons = () => {

  return (
    <View className='flex w-full h-auto flex-row gap-4 px-2'>
      <Pressable
        className='flex flex-1 rounded-full bg-black p-4'
        onPress={() => onSupportPhone()}
      >
        <Text className='text-white text-xs text-center w-auto'>Телефон поддержки</Text>
      </Pressable>
      <Pressable
        className='flex flex-1 rounded-full bg-[#EEEFF3] p-4'
        onPress={() => onSupportChat()}
      >
        <Text className='text-black text-xs text-center w-auto'>Чат с поддержкой</Text>
      </Pressable>
    </View>
  )
}

export default SupportButtons