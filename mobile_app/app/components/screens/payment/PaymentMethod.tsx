import {View, Text, Pressable} from "react-native";
import Svg, {Path} from "react-native-svg";
import {useOrderStore} from "../../../../stores/useOrderStore";

const PaymentMethod = () => {

  const orderStore = useOrderStore(state => state)

  return (
    <View className='flex flex-row gap-2 w-full'>
      <Pressable
        className={orderStore.paymentMethod === 'Перевод'
          ? 'flex flex-row justify-start items-center gap-2 flex-1 p-4 border rounded-2xl border-[#1B9F01]'
          : 'flex flex-row justify-start items-center gap-2 flex-1 p-4 border border-white rounded-2xl bg-[#EEEFF3]'
      }
        onPress={() => orderStore.setPaymentMethod('Перевод')}
      >
        <Text className='text-lg'>Перевод</Text>
        <Svg width="14" height="14" viewBox="0 0 21 19" fill="none">
          <Path
            d="M14.5 0H16.5V5.58594L18.793 3.29297L20.2072 4.70718L16.2072 8.70718C15.8167 9.09771 15.1835 9.09771 14.793 8.70718L10.793 4.70718L12.2072 3.29297L14.5 5.58579V0Z"
            fill="#1B1C1F"/>
          <Path
            d="M0.5 6C0.5 4.34315 1.84315 3 3.5 3H8.5V5H3.5C2.94772 5 2.5 5.44772 2.5 6L2.5 7H8.5V9H2.5V16C2.5 16.5523 2.94771 17 3.5 17H17.5C18.0523 17 18.5 16.5523 18.5 16V9L20.5 9V16C20.5 17.6569 19.1569 19 17.5 19H3.5C1.84315 19 0.5 17.6569 0.5 16V6Z"
            fill="#1B1C1F"/>
        </Svg>
      </Pressable>
      <Pressable
        className={orderStore.paymentMethod === 'СПБ'
          ? 'flex flex-row justify-start items-center gap-2 flex-1 p-4 border rounded-2xl border-[#1B9F01]'
          : 'flex flex-row justify-start items-center gap-2 flex-1 p-4 border border-white rounded-2xl bg-[#EEEFF3]'
      }
        onPress={() => orderStore.setPaymentMethod('СПБ')}
      >
        <Text className='text-lg'>СПБ</Text>
        <Svg width="14" height="14" viewBox="0 0 20 24" fill="none">
          <Path d="M0.542969 5.22461L3.44935 10.4196V13.5883L0.546369 18.7731L0.542969 5.22461Z" fill="#5B57A2"/>
          <Path d="M11.7031 8.5279L14.4265 6.85872L20.0001 6.85352L11.7031 11.9363V8.5279Z" fill="#D90751"/>
          <Path d="M11.6868 5.19336L11.7022 12.0713L8.78906 10.2813V0L11.6868 5.19336Z" fill="#FAB718"/>
          <Path d="M19.9992 6.85415L14.4254 6.85934L11.6868 5.19336L8.78906 0L19.9992 6.85415Z" fill="#ED6F26"/>
          <Path d="M11.7022 18.8019V15.465L8.78906 13.709L8.79066 24.0005L11.7022 18.8019Z" fill="#63B22F"/>
          <Path d="M14.4189 17.1479L3.44915 10.4196L0.542969 5.22461L19.9874 17.1411L14.4189 17.1479Z" fill="#1487C9"/>
          <Path d="M8.79102 24L11.7022 18.8014L14.4188 17.1474L19.9873 17.1406L8.79102 24Z" fill="#017F36"/>
          <Path d="M0.546875 18.7731L8.81341 13.7091L6.03423 12.0039L3.44985 13.5883L0.546875 18.7731Z" fill="#984995"/>
        </Svg>
      </Pressable>
    </View>
  )
}

export default PaymentMethod