import {View, Text, Pressable} from "react-native";
import {useOrderStore} from "../../../../stores/useOrderStore";
import {useEffect} from "react";
import { useDataStore } from "../../../../stores/useDataStore";

const PaymentTips = () => {
  const orderStore = useOrderStore(state => state)
  const dataStore = useDataStore(state => state)

  useEffect(() => {
    if (orderStore.curierTips) {
      let tips = 0
      if (orderStore.curierTips !== 'Без чая') {
        const price = dataStore.cart.reduce((total, cartItem) => {
          return total + cartItem.amount * cartItem.product.price
        }, 0);
        switch (orderStore.curierTips) {
          case '5%':
            tips = parseFloat((price * 0.05).toFixed(2))
            break;
          case '10%':
            tips = parseFloat((price * 0.1).toFixed(2))
            break;
          case '20%':
            tips = parseFloat((price * 0.2).toFixed(2))
            break;
          default:
            tips = 0
            break;
        }
      }
      orderStore.setOrder({...orderStore.order!, curierTips: tips})
    }
  }, [orderStore.curierTips]);

  return (
    <View className="flex flex-row w-full gap-2">
      <Pressable
        className={orderStore.curierTips === 'Без чая'
          ? 'flex p-4 border rounded-2xl border-[#1B9F01]'
          : 'flex p-4 border border-white rounded-2xl bg-[#EEEFF3]'
      }
        onPress={() => orderStore.setCurierTips('Без чая')}
      >
        <Text className='text-lg'>Без чая</Text>
      </Pressable>
      <Pressable
        className={orderStore.curierTips === '5%'
          ? 'flex p-4 border rounded-2xl w-20 border-[#1B9F01]'
          : 'flex p-4 border border-white w-20 rounded-2xl bg-[#EEEFF3]'
      }
        onPress={() => orderStore.setCurierTips('5%')}
      >
        <Text className='text-lg'>5%</Text>
      </Pressable>
      <Pressable
        className={orderStore.curierTips === '10%'
          ? 'flex p-4 border rounded-2xl border-[#1B9F01]'
          : 'flex p-4 border border-white rounded-2xl bg-[#EEEFF3]'
      }
        onPress={() => orderStore.setCurierTips('10%')}
      >
        <Text className='text-lg'>10%</Text>
      </Pressable>
      <Pressable
        className={orderStore.curierTips === "20%"
          ? 'flex p-4 border rounded-2xl border-[#1B9F01]'
          : 'flex p-4 border border-white rounded-2xl bg-[#EEEFF3]'
      }
        onPress={() => orderStore.setCurierTips('20%')}
      >
        <Text className='text-lg'>20%</Text>
      </Pressable>
    </View>
  )
}

export default PaymentTips