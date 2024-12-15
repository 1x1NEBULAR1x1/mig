import {View, Text, ScrollView} from "react-native";
import React, {useEffect} from "react";
import ProfileData from "./ProfileData";
import OrderList from "./OrderList";
import ProfileFunctions from "./ProfileFunctions";
import { useUIStore } from "../../../../stores/useUIStore";
import {useDataStore} from "../../../../stores/useDataStore";
import RegisterMenu from "./RegisterMenu";
import VerifyMenu from "./VerifyMenu";
import {useUserToken} from "../../../../hooks/useAuth";
import {useUser} from "../../../../hooks/useUser";
import Spinner from "react-native-loading-spinner-overlay";
import { useCitiesStore } from "../../../../stores/useCitiesStore";
import SupportButtons from "./SupportButtons";


const Profile = () => {
  const uiStore = useUIStore(state => state)
  const auth = useUserToken()
  const dataStore = useDataStore(state => state)
  const {user, refetch, isSuccess: isSuccessUser} = useUser(auth.token)
  const citiesStore = useCitiesStore(state => state)

  useEffect(() => {
    if (auth.token) {
      refetch()
    }
  }, [auth.token]);

  useEffect(() => {
    if (user && !auth.loading && auth.token && isSuccessUser) {
      dataStore.setUser(user.data)
      dataStore.setOrders(user.data.orders)
      if (user.data.cityId) {
        citiesStore.setSelectedCity(citiesStore.cities.find(c => c.id === user.data.cityId))
      }
    }
  }, [user, auth.token, auth.loading]);

  return (
    <View className="p-2 bg-[#EEEFF3] pt-11 w-full h-full flex flex-col">
      <View className='flex items-center justify-center p-3 mb-2 px-6 bg-white rounded-2xl'>
        <Text className="text-black text-2xl font-semibold">Профиль</Text>
      </View>
      <ScrollView className="w-full h-auto flex flex-col pb-0 bg-white rounded-2xl gap-2">
        <View className="w-full h-auto flex flex-col gap-2">
          {dataStore.user && !(auth.loading)
            && <View className='w-full h-auto bg-white rounded-2xl p-4'>
              <ProfileData />
              <OrderList />
              <ProfileFunctions/>
            </View>
          }
          {!dataStore.user && !(auth.loading)  &&
            <>
              {!uiStore.isVerifying &&<RegisterMenu/>}
              {uiStore.isVerifying &&<VerifyMenu/>}
            </>
          }
          {auth.loading &&
            <Spinner
              visible={true}
              textContent={'Загрузка профиля...'}
              textStyle={{color: '#1B9F01'}}
            />
          }
        </View>
        <SupportButtons />
      </ScrollView>
    </View>
  )
}

export default Profile

