import {View, Text, TextInput, Pressable} from "react-native";
import {useUIStore} from "../../../../stores/useUIStore";
import {useVerification} from "../../../../hooks/useVerification";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";
import {useEffect, useState} from "react";
import {useDataStore} from "../../../../stores/useDataStore";
import {useUserToken} from "../../../../hooks/useAuth";
import {useUser} from "../../../../hooks/useUser";
import {useCitiesStore} from "../../../../stores/useCitiesStore";

const VerifyMenu = ({doNotNavigate}: {doNotNavigate?: boolean}) => {
  const uiStore = useUIStore(state => state)
  const {navigate} = useTypedNavigation()
  const phoneNumber = "%2B" + uiStore.phoneNumber!.replaceAll(" ", "").slice(1)
  const {result, refetch, isSuccess, isRefetching, isError} = useVerification(phoneNumber, uiStore.code)
  const auth = useUserToken()
  const dataStore = useDataStore(state => state)
  const {user, refetch: refetchUser, isSuccess: isSuccessUser, isRefetching: isRefetchingUser} = useUser(auth.token)
  const citiesStore = useCitiesStore(state => state)
  const verifyPhone = () => {
    refetch()
  }

  useEffect(() => {
    if (auth.token) {
      refetchUser()
    }
  }, [auth.token]);

  useEffect(() => {
    if (result && !isRefetching && isSuccess && result.data.access_token) {
      auth.saveToken(result.data.access_token)
    }
  }, [result, isRefetching, isSuccess]);

  useEffect(() => {
    if (user && isSuccessUser) {
      dataStore.setUser(user.data)
      uiStore.setIsVerifying(false)
      uiStore.setPhoneNumber('')
      uiStore.setCode('')
      dataStore.setOrders(user.data.orders)
      if (user.data.addresses && user.data.addresses.length > 0) {
        citiesStore.setSelectedCity(citiesStore.cities.find(c => c.id === user.data.cityId))
      }
      if (doNotNavigate){
        navigate('Profile')
      }
    }
  }, [user, isSuccessUser]);

  return (
    <View className='p-4 py-6 bg-white w-full h-auto flex-col gap-4 rounded-2xl'>
      <Text>Введите код подтверждения</Text>
      <Text>Введённый номер {uiStore.phoneNumber}</Text>
      <Pressable
        className="w-min"
        onPress={() => uiStore.setIsVerifying(false)}
      >
        <Text className="text-[#1B9F01] text-sm w-auto">Изменить номер</Text>
      </Pressable>
      <TextInput
        className="w-full h-18 text-xl border-gray-300 border rounded-2xl px-2"
        placeholder="Код подтверждения"
        keyboardType="phone-pad"
        onChangeText={text => uiStore.setCode(text.slice(0, 6))}
        value={uiStore.code}
      />
      <Pressable
        className={
          ((uiStore.code != undefined) && uiStore.code.length === 6)
            ? "bg-[#1B9F01] p-2 px-4 rounded-full w-auto transition-all duration-150"
            : "bg-[#EEEFF3] p-2 px-4 rounded-full w-auto transition-all duration-150"
        }
        onPress={() => verifyPhone()}
        disabled={uiStore.code.length !== 6}
      >
        <Text className="text-white text-xl text-center w-auto">Подтвердить</Text>
      </Pressable>
      {isError && !isRefetching && (uiStore.code && uiStore.code.length === 6) && <Text className="text-[#EC4646] text-sm">Неверный код</Text>}
      {isRefetching || isRefetchingUser && <Text>Подтверждение данных...</Text>}
      {auth.loading && <Text>Сохранение данных...</Text>}
    </View>
  )
}

export default VerifyMenu