import {View, Text, Pressable} from "react-native";
import { useTypedNavigation } from "../../../../hooks/useTypedNavigation";
import { useDataStore } from "../../../../stores/useDataStore";
import { useUserToken } from "../../../../hooks/useAuth";
import {useCitiesStore} from "../../../../stores/useCitiesStore";

const ProfileLeaveModal = () => {
  const {navigate} = useTypedNavigation()
  const dataStore = useDataStore(state => state)
  const auth = useUserToken()
  const citiesStore = useCitiesStore(state => state)

  const exitProfile = () => {
    dataStore.setUser(undefined)
    citiesStore.setSelectedCity(undefined)
    auth.removeToken().then(() =>
      {
        navigate('Profile')
      }
    )
  }

  return (
    <View className='w-screen h-screen flex items-center justify-center bg-[#EEEFF3] px-6'>
      <View className='flex flex-col gap-6 p-4 h-auto bg-white rounded-3xl'>
        <Text className='text-black text-xl'>Вы уверены, что хотите выйти из профиля?</Text>
        <View className='flex flex-row gap-2'>
          <Pressable
            className='bg-[#EEEFF3] p-2 flex-1 rounded-2xl px-4 items-center justify-center'
            onPress={() => exitProfile()}
          >
            <Text className='text-black text-xl'>Выйти</Text>
          </Pressable>
          <Pressable
            className='bg-[#1B9F01] p-2 flex-1 rounded-2xl px-4 items-center justify-center'
            onPress={() => navigate('Profile')}
          >
            <Text className='text-white text-xl'>Назад</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default ProfileLeaveModal