import {View, Text, Pressable, ScrollView} from "react-native"
import {useDataStore} from "../../../../stores/useDataStore";
import React, {useEffect, useState} from "react";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {useCitiesStore} from "../../../../stores/useCitiesStore";
import CartList from "./CartList";
import CartEmptyMessage from "./CartEmptyMessage";
import CategoriesList from "./CategoriesList";
import AddressData from "./AddressData";
import {useUser} from "../../../../hooks/useUser";
import {useUIStore} from "../../../../stores/useUIStore";
import {useRecommendedProducts} from "../../../../hooks/useRecommendedProducts";
import Recomendations from "./Recomendations";
import {useOrderStore} from "../../../../stores/useOrderStore";
import axios from "axios";
import {useOrderPriorities} from "../../../../hooks/useOrderPriorities";
import {useUserToken} from "../../../../hooks/useAuth";
import RegisterMenu from "../profile/RegisterMenu";
import VerifyMenu from "../profile/VerifyMenu";
import Svg, {Path} from "react-native-svg";
import OrderDetails from "./OrderDetails";
import {yandexMapsApiKey} from "../../../../requests/load_data";
let debounce = require('lodash/debounce');

type AddressError = 'street' | 'house' | 'flat' | 'floor' | 'entrance' | 'address' | undefined

const Cart = () => {
  const {navigate} = useTypedNavigation()
  const orderStore = useOrderStore(state => state)
  const citiesStore = useCitiesStore(state => state)
  const dataStore = useDataStore(state => state)
  const uiStore = useUIStore(state => state)
  const auth = useUserToken()
  const {user, isSuccess: isSuccessUser, refetch} = useUser(auth.token)
  const [error, setError] = useState<AddressError>()
  const [buttonEnabled, setButtonEnabled] = useState(false)

  useEffect(() => {
    orderStore.setIsPaymentAcception(false)
  }, []);

  useEffect(() => {
    refetch()
  }, [auth.token]);

  useEffect(() => {
    if (user?.data && isSuccessUser && auth.token && !auth.loading) {
      dataStore.setUser(user.data);
      citiesStore.setSelectedCity(citiesStore.cities.find(c => c.id === user.data.cityId));
    }
  }, [user?.data, isSuccessUser, auth.token, auth.loading]);

  const getCoordinates = debounce((address: string) => {
    axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${yandexMapsApiKey}&geocode=${encodeURIComponent(address)}`)
      .then(res => {
        const point = res.data.response.GeoObjectCollection.featureMember[0]?.GeoObject.Point.pos;
        if (point) {
          const [longitude, latitude] = point.split(" ");
          console.log(longitude, latitude)
          if (latitude && longitude) {
            orderStore.setLongtude(parseFloat(longitude));
            orderStore.setLatitude(parseFloat(latitude));
          }
        } else {
          setError('address');
        }
      })
      .catch(() => setError('address'));
  }, 500);

  useEffect(() => {
    if (orderStore.orderStreet && orderStore.orderHouse) {
      const address = `${citiesStore.selectedCity?.name}, ${orderStore.orderStreet}, ${orderStore.orderHouse}`;
      getCoordinates(address);
    }
  }, [orderStore.orderStreet, orderStore.orderHouse]);

  useEffect(() => {
    if (!orderStore.orderStreet) {
      setError('street')
    } else if (!orderStore.orderHouse) {
      setError('house')
    } else if (!orderStore.orderFlat) {
      setError('flat')
    } else if (!orderStore.orderFloor) {
      setError('floor')
    } else {
      setError(undefined)
    }
  }, [
    orderStore.orderStreet,
    orderStore.orderHouse,
    orderStore.orderFlat,
    orderStore.orderEntrance,
    orderStore.orderFloor
  ]);

  useEffect(() => {
    setButtonEnabled(!error)
  }, [error]);

  const {data: orderPriorities, isSuccess: isOrderPrioritiesSuccess} = useOrderPriorities()

  useEffect(() => {
    if (orderPriorities && isOrderPrioritiesSuccess) {
      dataStore.setOrderPriorities(orderPriorities)
    }
  }, [orderPriorities, isOrderPrioritiesSuccess]);

  useEffect(() => {
    if (uiStore.recomendations.length === 0 && dataStore.categories?.length > 0) {
      const products = useRecommendedProducts(dataStore.categories, dataStore.cart);
      uiStore.setRecomendations(products);
    }
  }, [uiStore.recomendations.length, dataStore.categories?.length]);

  useEffect(() => {if (user && isSuccessUser) dataStore.setUser(user.data)}, [user, isSuccessUser])

  return (
    <ScrollView className="flex flex-col gap-2 p-2 pt-11 align-center mb-2 w-auto h-auto bg-[#EEEFF3]">
      <View className="flex flex-row p-2 w-full items-center justify-evenly mb-2 bg-white rounded-2xl">
        <Text className="text-black text-2xl font-semibold">Корзина</Text>
      </View>
      {dataStore.cart && dataStore.cart.length > 0
        ? <>
          {!dataStore.user && !(auth.loading)  &&
            <>
              {!uiStore.isVerifying &&<RegisterMenu/>}
              {uiStore.isVerifying &&<VerifyMenu doNotNavigate/>}
            </>
          }
          {dataStore.user &&
            <View className='flex flex-row justify-between gap-2 bg-white rounded-2xl p-2 py-4'>
              <Text className="text-black p-3 w-auto border border-[#BDBFC9] rounded-full px-5">
                {`+7 ${dataStore.user.phoneNumber.slice(2, 5)} ${dataStore.user.phoneNumber.slice(5, 8)} ${dataStore.user.phoneNumber.slice(8, 10)} ${dataStore.user.phoneNumber.slice(10, 12)}`.trim()}
              </Text>
              <View className='flex flex-row items-center justify-center gap-4 bg-[#EEEFF3] rounded-full p-3 px-5'>
                <Text className='text-[#BDBFC9]'>Подтверждён</Text>
                <Svg width="16" height="16" viewBox="0 0 16 12" fill="none">
									<Path fillRule="evenodd" clipRule="evenodd"
												d="M15.0483 2.09257L6.2983 10.8426C5.97287 11.168 5.44523 11.168 5.11979 10.8426L0.953125 6.67591L2.13164 5.4974L5.70905 9.07481L13.8698 0.914062L15.0483 2.09257Z"
												fill="#BDBFC9"/>
								</Svg>
              </View>

						</View>
          }
          <AddressData error={error}/>
          <View className='p-4 flex flex-col gap-4 w-full rounded-2xl bg-white mb-2'>
            <OrderDetails />
          </View>
          <Pressable
            onPress={() => navigate('Payment')}
            disabled={!(buttonEnabled && dataStore.user)}
            className={!(buttonEnabled && dataStore.user)
              ? 'mb-2 flex flex-col p-4 mt-1 h-auto w-full bg-[#56585F] rounded-2xl'
              : 'mb-2 b-2 flex flex-col p-4 mt-1 h-auto w-full bg-[#1B9F01] rounded-2xl'
            }
            >
              <Text className="text-[#EEEFF3] font-bold text-xl text-center">Оформить заказ</Text>
            </Pressable>
          <CartList />
          <Recomendations />
        </>
        : <View className="flex flex-col h-auto justify-center items-center gap-2 w-full">
          <CartEmptyMessage />
          {citiesStore.selectedCity && dataStore.categories && dataStore.categories.length > 0
            ? <CategoriesList />
            : <Pressable
              className='flex flex-col p-4 mt-1 h-auto w-full bg-[#1B9F01] rounded-2xl'
              onPress={() => navigate('Home')}
            >
              <Text className="text-white font-bold text-xl text-center">Перейти к выбору города</Text>
          </Pressable>}
      </View>}
      <View className="flex flex-row p-6 w-full items-center justify-evenly mb-2"></View>
    </ScrollView>
  )
}

export default Cart;