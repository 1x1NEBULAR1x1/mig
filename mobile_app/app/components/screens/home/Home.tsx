import { View } from "react-native"
import { useCitiesStore } from "../../../../stores/useCitiesStore"
import SelectCity from "./SelectCity";
import SelectCategory from "./SelectCategory";
import {useEffect, useState} from "react";
import {useCities} from "../../../../hooks/useCities";
import React from "react";
import { useUserToken } from "../../../../hooks/useAuth";
import {useUser} from "../../../../hooks/useUser";
import {useDataStore} from "../../../../stores/useDataStore";
import Spinner from "react-native-loading-spinner-overlay";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {useCheckPaymentStatus} from "../../../../hooks/useGetAcceptedOrder";
import {useOrderIds} from "../../../../hooks/useOrdersIds";
import {useUIStore} from "../../../../stores/useUIStore";
import {useReloadOrders} from "../../../../hooks/useReloadOrders";
import {useOrdersStatuses} from "../../../../hooks/useOrdersStatuses";

const Home = ( ) => {
  const auth = useUserToken()
  const dataStore = useDataStore(state => state)
  const {user, refetch, isSuccess: isSuccessUser, isLoading: isLoadingUser} = useUser(auth.token)
  const citiesStore = useCitiesStore(state => state)
  const {cities, isSuccess: isSuccessCities, isLoading: isLoadingCities} = useCities()
  const {navigate} = useTypedNavigation()
  const orderIdsStore = useOrderIds()
  const uiStore = useUIStore(state => state)
  const reloadOrders = useReloadOrders(dataStore.user?.id)
  const ordersStatuses = useOrdersStatuses()

  useEffect(() => {
    if (dataStore.orders) {
      dataStore.orders.forEach(order => {
        ordersStatuses.addOrder({orderId: order.id, statusId: order.status.id})
      })
    }
  }, [dataStore.orders]);

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



  useEffect(() => {
    if (cities && isSuccessCities) {
      citiesStore.setCities(cities)
    }
  }, [cities, isSuccessCities]);

  useEffect(() => {
    if (auth.token) {
      refetch()
    }
  }, [auth.token]);
  useEffect(() => {
    if (user && isSuccessUser && auth.token && !auth.loading) {
      dataStore.setUser(user.data)
      if (user.data.cityId) {
        citiesStore.setSelectedCity(citiesStore.cities.find(c => c.id === user.data.cityId))
      }
    }
  }, [user?.data, isSuccessUser, auth.token, auth.loading]);

  return (
    <>
      {isLoadingUser
        ? <Spinner
          visible={true}
          textContent={'Загрузка данных пользователя...'}
          textStyle={{color: '#1B9F01', fontSize: 14}}
        />
        : isLoadingCities
          ? <Spinner
            visible={true}
            textContent={'Загрузка данных городов...'}
            textStyle={{color: '#1B9F01'}}
          />
          : <View className="flex justify-center align-center w-screen h-screen bg-[#EEEFF3]">
            {!citiesStore.selectedCity ? <SelectCity/> : <SelectCategory city={citiesStore.selectedCity}/>}
          </View>}
    </>

  )
}

export default Home;