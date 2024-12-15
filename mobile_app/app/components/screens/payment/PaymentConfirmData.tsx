import {Text, View, TouchableOpacity, Clipboard} from "react-native";
import Svg, {Path} from "react-native-svg";
import {cardNumber, cardOwner} from "../../../../requests/load_data";
import { useOrderStore } from "../../../../stores/useOrderStore";
import {useEffect, useState} from "react";
import {useOrderIds} from "../../../../hooks/useOrdersIds";
import {useUIStore} from "../../../../stores/useUIStore";
import {useReloadOrders} from "../../../../hooks/useReloadOrders";
import {useDataStore} from "../../../../stores/useDataStore";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import React from "react";

const PaymentConfirmData = () => {
  const orderStore = useOrderStore(state => state)
  const [orderPrice, setOrderPrice] = useState<number | undefined>(undefined)
  const orderIdsStore = useOrderIds()
  const dataStore = useDataStore(state => state)
  const uiStore = useUIStore(state => state)
  const reloadOrders = useReloadOrders(dataStore.user?.id)
  const {navigate} = useTypedNavigation()

  useEffect(() => {
    if (orderStore.orderTotalPrice && !orderPrice) {
      setOrderPrice(orderStore.orderTotalPrice)
    }
  }, [orderStore.orderTotalPrice, orderPrice]);

  const checkOrders = (ordersIds: number[]) => {
    if (!ordersIds || ordersIds.length === 0) return
    ordersIds.forEach(id => {
      const order = reloadOrders.data?.find(o => o.id === id)
      if (order) {
        if (order.isPaymentAccepted) {
          orderIdsStore.removeOrderId(id).then(
            () => {
              uiStore.setViewOrder(order)
              navigate('PaymenSuccessScreen')
            }
          )
        }
      }
    })
  }

  useEffect(() => {
    if (orderIdsStore.orderIds && orderIdsStore.orderIds.length > 0 && !orderIdsStore.loading) {
        const intervalId = setInterval(() => {
          checkOrders(orderIdsStore.orderIds)
      }, 10000)
      return () => clearInterval(intervalId)
    }
  }, [orderIdsStore.orderIds, orderIdsStore.loading])

  const handleCopyToClipboard = async () => {
    Clipboard.setString(cardNumber);
  };

  const handleCopyToClipboardOwner = async () => {
    Clipboard.setString(cardOwner);
  };


  return (<>
    <Text className='text-lg text-black font-semibold pl-2'>Номер карты</Text>
    <TouchableOpacity onPress={handleCopyToClipboard} className='flex flex-row gap-4 w-auto justify-between items-center p-4 bg-[#EEEFF3] rounded-2xl'>
      <Text className='text-[#56585F] font-semibold text-xl w-auto'>{`${cardNumber}`}</Text>
      <View className='w-5 h-5 flex items-center justify-center mr-3'>
        <Svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <Path d="M1.33333 0.5C0.873096 0.5 0.5 0.873096 0.5 1.33333V11.3333C0.5 11.7936 0.873096 12.1667 1.33333 12.1667H2.16667V2.16667H12.1667V1.33333C12.1667 0.873096 11.7936 0.5 11.3333 0.5H1.33333Z" fill="#56585F"/>
          <Path fillRule="evenodd" clipRule="evenodd" d="M4.66667 3.83333C4.20643 3.83333 3.83333 4.20643 3.83333 4.66667V14.6667C3.83333 15.1269 4.20643 15.5 4.66667 15.5H14.6667C15.1269 15.5 15.5 15.1269 15.5 14.6667V4.66667C15.5 4.20643 15.1269 3.83333 14.6667 3.83333H4.66667ZM5.5 13.8333V5.5H13.8333V13.8333H5.5Z" fill="#56585F"/>
        </Svg>
      </View>
    </TouchableOpacity>
    <View className='h-[1px] w-full bg-[#EEEFF3] mt-2'></View>
      <Text className='text-lg text-black font-semibold pl-2'>Получатель</Text>
      <TouchableOpacity onPress={handleCopyToClipboardOwner}>
        <Text className='text-lg text-[#1B1C1F] pl-2'>{cardOwner}</Text>
        </TouchableOpacity>
      <View className='h-[1px] w-full bg-[#EEEFF3] mt-2'></View>
      <Text className='text-lg text-black font-semibold pl-2'>Сумма</Text>
      <Text className='text-2xl mb-4 font-semibold text-[#1B1C1F] pl-2'>
        {orderPrice?.toFixed(2)} ₽
      </Text>
      <View className='bg-[#F8DFD9] w-full p-4 rounded-2xl flex items-center justify-between flex-row gap-2'>
        <View className='w-10 h-10 flex items-center justify-center'>
          <Svg width="40" height="40" viewBox="0 0 22 20" fill="none">
            <Path d="M10 8V13H12V8H10Z" fill="#EC4646"/>
            <Path d="M11 16.75C10.3096 16.75 9.75 16.1904 9.75 15.5C9.75 14.8096 10.3096 14.25 11 14.25C11.6904 14.25 12.25 14.8096 12.25 15.5C12.25 16.1904 11.6904 16.75 11 16.75Z" fill="#EC4646"/>
            <Path fillRule="evenodd" clipRule="evenodd" d="M11.8742 0.514357C11.6978 0.196892 11.3632 0 11 0C10.6368 0 10.3022 0.196892 10.1258 0.514357L0.125843 18.5144C-0.0462301 18.8241 -0.0415561 19.2017 0.138129 19.5071C0.317815 19.8125 0.64568 20 1 20H21C21.3543 20 21.6822 19.8125 21.8619 19.5071C22.0416 19.2017 22.0462 18.8241 21.8742 18.5144L11.8742 0.514357ZM11 3.05913L19.3005 18H2.69951L11 3.05913Z" fill="#EC4646"/>
          </Svg>
        </View>
        <Text className='text-xs w-auto text-[#EC4646] font-semibold pl-2 mr-8'>
          Переводите ровно ту сумму, что указана в информации к оплате, в противном случае вы потеряете свои средства
        </Text>
      </View>
    </>
  )
}

export default PaymentConfirmData