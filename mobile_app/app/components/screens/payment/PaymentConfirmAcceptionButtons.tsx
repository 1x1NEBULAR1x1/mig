import {Text, TouchableOpacity} from "react-native";
import React, {useEffect} from "react";
import {useOrderStore} from "../../../../stores/useOrderStore";
import {useDataStore} from "../../../../stores/useDataStore";
import {useAddOrderMutation} from "../../../../hooks/useOrderMutation";
import { useTypedNavigation } from "../../../../hooks/useTypedNavigation";
import {useUserToken} from "../../../../hooks/useAuth";
import { useOrderIds } from "../../../../hooks/useOrdersIds";


const PaymentConfirmAcceptionButtons = () => {
  const orderStore = useOrderStore(state => state)
  const dataStore = useDataStore(state => state)
  const {data, isPending, mutate, isError} = useAddOrderMutation()
  const {navigate} = useTypedNavigation()
  const auth = useUserToken()
  const orderIds = useOrderIds()

  const onPressAccept = () => {
    if (auth.token) {
      mutate({order: orderStore.order!, token: auth.token})
      orderStore.setOrderTotalPrice(orderStore.order!.totalPrice!)
    }
  }

  useEffect(() => {
    if (data) {
      dataStore.setOrders([...dataStore.orders, data])
      orderIds.addOrderId(data.id)
      orderStore.setIsPaymentAcception(true)
      dataStore.removeAllCart()
      orderStore.clear()
    }
  }, [data]);



  return(<>
    {isError && <Text className='text-xs text-red-300'>
      Произошла ошибка при отправке данных, попробуйте снова
    </Text>}
    <TouchableOpacity
      className={`w-full p-4 rounded-full bg-[${isPending ? '#EEEFF3' : '#1B9F01'}] flex items-center justify-center`}
      onPress={onPressAccept}
      disabled={isPending}
    >
      <Text className={`text-lg text-${isPending ? '#56585F' : 'white'} font-semibold`}>{isPending ? 'Отправка данных заказа...' : 'Я оплатил'}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className='w-full p-4 rounded-full bg-[#EEEFF3] flex items-center justify-center'
      onPress={() => navigate('Cart')}
    >
      <Text className='text-lg text-[#56585F] font-semibold'>Отменить заказ</Text>
    </TouchableOpacity>
  </>)
}

export default PaymentConfirmAcceptionButtons