import {Text, View} from "react-native";
import Svg, {Path} from "react-native-svg";
import {useTypedNavigation} from "../../../hooks/useTypedNavigation";
import {useEffect} from "react";
import {useDataStore} from "../../../stores/useDataStore";
import {useUser} from "../../../hooks/useUser";
import {useCitiesStore} from "../../../stores/useCitiesStore";
import {useUserToken} from "../../../hooks/useAuth";


const PaymenSuccessScreen = () => {
  const {goBack} = useTypedNavigation()
  const auth = useUserToken()
  const dataStore = useDataStore(state => state)
  const {user, refetch} = useUser(auth.token)
  const citiesStore = useCitiesStore(state => state)

  useEffect(() => {
    if (auth.token) {
      refetch()
    }
  }, [auth.token]);

  useEffect(() => {
    if (user && !auth.loading && auth.token) {
      dataStore.setUser(user.data)
      dataStore.setOrders(user.data.orders)
      if (user.data.cityId) {
        citiesStore.setSelectedCity(citiesStore.cities.find(c => c.id === user.data.cityId))
      }
    }
  }, [user, auth.token, auth.loading]);
  useEffect(() => {
    setTimeout(() => goBack(), 5000)
  }, []);

  return(
    <View className="flex flex-col justify-center items-center p-4 pt-11 w-full h-full bg-[#EEEFF3]">
      <View className='flex flex-col p-4 py-8 gap-2 w-full bg-white rounded-3xl'>
        <View className='flex w-full justify-center mb-4 items-center'>
          <View className='w-28 rounded-full bg-[#1B9F01] justify-center items-center aspect-square'>
            <Svg width="44" height="44" viewBox="0 0 39 27" fill="none">
              <Path fillRule="evenodd" clipRule="evenodd" d="M38.1755 3.14454L14.988 26.332C14.1256 27.1945 12.7273 27.1945 11.8649 26.332L0.823242 15.2904L3.9463 12.1673L13.4264 21.6475L35.0524 0.0214844L38.1755 3.14454Z" fill="white"/>
            </Svg>
          </View>
        </View>
        <Text className='text=[#1B1C1F] font-semibold text-2xl text-center'>Оплата прошла успешно</Text>
        <Text className='text-[#1B1C1F] text-center'>Страница закроется автоматически закроется через 5 секунд</Text>
      </View>
    </View>
  )
}

export default PaymenSuccessScreen