import {View, Text} from "react-native";
import Svg, {Path} from "react-native-svg";
import { useDataStore } from "../../../../stores/useDataStore";

const ProfileData = () => {
  const dataStore = useDataStore(state => state)

  return (
    <View className="w-full h-auto flex flex-col gap-2">
      <View className="w-full h-auto flex flex-row items-center gap-6 p-2 bg-[#EEEFF3] rounded-2xl">
        <View className="w-14 h-14 aspect-square flex justify-center items-center p-2 bg-white rounded-full">
          <Svg width="18" height="18" viewBox="0 0 18 20" fill="none">
            <Path fillRule="evenodd" clipRule="evenodd" d="M9 0C6.23858 0 4 2.23858 4 5C4 7.76142 6.23858 10 9 10C11.7614 10 14 7.76142 14 5C14 2.23858 11.7614 0 9 0ZM6 5C6 3.34315 7.34315 2 9 2C10.6569 2 12 3.34315 12 5C12 6.65685 10.6569 8 9 8C7.34315 8 6 6.65685 6 5Z" fill="#1B9F01"/>
            <Path d="M9.0001 11C3.58967 11 0.5 15.5983 0.5 20H2.5C2.5 16.4017 4.97308 13 9.0001 13C13.0271 13 15.5 16.4017 15.5 20H17.5C17.5 15.5983 14.4106 11 9.0001 11Z" fill="#1B9F01"/>
          </Svg>
        </View>
        <Text className="text-black text-xl">{dataStore.user!.phoneNumber}</Text>
      </View>
    </View>
  )
}

export default ProfileData