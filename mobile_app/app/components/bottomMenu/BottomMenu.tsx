import {View, Text, Pressable} from "react-native";
import MIG from "../mig/MIG";
import {useTypedNavigation} from "../../../hooks/useTypedNavigation";
import Svg, {Path} from "react-native-svg";
import {useDataStore} from "../../../stores/useDataStore";
import {useEffect, useState} from "react";
import {useUserToken} from "../../../hooks/useAuth";
import {useUser} from "../../../hooks/useUser";

const BottomMenu = () => {
  const navigation = useTypedNavigation()
  const dataStore = useDataStore(state => state)
  const [activeOrdersCount, setActiveOrdersCount] = useState(0)
  const auth = useUserToken()
  const {user, refetch, isSuccess: isSuccessUser} = useUser(auth.token)

  useEffect(() => {
    if (auth.token) {
      refetch()
    }
  }, [auth.token]);
  useEffect(() => {
    if (user && isSuccessUser && auth.token && !auth.loading) {
      setActiveOrdersCount(user.data.orders.filter((order) => order.status.id !== 0 && order.status.id !== 5).length)
    }
  }, [user?.data, isSuccessUser, auth.token, auth.loading]);

  return (
    <View
      className="flex gap-4 justify-center align-center w-screen h-auto bg-[#FFFFFF] p-2 rounded-t-2xl flex-row"
    >
      <Pressable
        className="flex-1 justify-center items-center"
        onPress={() => navigation.navigate('Home')}
      >
        <MIG className='flex justify-center items-center' width={'80%'}/>
      </Pressable>
      <Pressable
        className="flex-1 justify-center items-center "
        onPress={() => navigation.navigate('Cart')}
      >
        {dataStore.cart && dataStore.cart.length > 0 &&
          <View className='absolute right-10 top-0 rounded-full bg-red-500 w-5 h-5'>
            <Text className='text-white text-center text-xs'>{dataStore.cart.length}</Text>
          </View>
        }
        <Svg width="23" height="20" viewBox="0 0 23 20" fill="none">
          <Path d="M8 6V10H10V6H8Z" fill="#1B1C1F"/>
          <Path d="M12 10V6H14V10H12Z" fill="#1B1C1F"/>
          <Path d="M16 6V10H18V6H16Z" fill="#1B1C1F"/>
          <Path fillRule="evenodd" clipRule="evenodd"
                d="M0 0H2.38197C3.13951 0 3.83204 0.428004 4.17082 1.10557L4.61803 2H20.7802C22.0423 2 22.9889 3.15465 22.7414 4.39223L21.3021 11.5883C21.0217 12.9904 19.7911 14 18.3608 14H6C5.44772 14 5 14.4477 5 15C5 15.5523 5.44772 16 6 16H21V18H19.9146C19.9699 18.1564 20 18.3247 20 18.5C20 19.3284 19.3284 20 18.5 20C17.6716 20 17 19.3284 17 18.5C17 18.3247 17.0301 18.1564 17.0854 18H7.91465C7.96992 18.1564 8 18.3247 8 18.5C8 19.3284 7.32843 20 6.5 20C5.67157 20 5 19.3284 5 18.5C5 18.2765 5.04888 18.0644 5.13653 17.8739C3.90057 17.503 3 16.3567 3 15C3 13.7591 3.7534 12.6942 4.82773 12.2377L3.04568 3.32743L2.38197 2H0V0ZM5.2198 4L6.8198 12H18.3608C18.8372 12 19.2474 11.6638 19.341 11.1961L20.7802 4H5.2198Z"
                fill="#1B1C1F"/>
        </Svg>
      </Pressable>
      <Pressable
        className="flex-1 justify-center items-center"
        onPress={() => navigation.navigate('Profile')}
      >
        {activeOrdersCount > 0 &&
          <View className='absolute right-10 top-0 rounded-full bg-red-500 w-5 h-5'>
            <Text className='text-white text-center text-xs'>{activeOrdersCount}</Text>
          </View>
        }
        <Svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <Path fillRule="evenodd" clipRule="evenodd"
                d="M9 0C6.23858 0 4 2.23858 4 5C4 7.76142 6.23858 10 9 10C11.7614 10 14 7.76142 14 5C14 2.23858 11.7614 0 9 0ZM6 5C6 3.34315 7.34315 2 9 2C10.6569 2 12 3.34315 12 5C12 6.65685 10.6569 8 9 8C7.34315 8 6 6.65685 6 5Z"
                fill="#1B1C1F"/>
          <Path
            d="M9.0001 11C3.58967 11 0.5 15.5983 0.5 20H2.5C2.5 16.4017 4.97308 13 9.0001 13C13.0271 13 15.5 16.4017 15.5 20H17.5C17.5 15.5983 14.4106 11 9.0001 11Z"
            fill="#1B1C1F"/>
        </Svg>
      </Pressable>
    </View>
  )
}

export default BottomMenu;
