import {Pressable, Text, View} from "react-native";
import Svg, {Path} from "react-native-svg";
import {useTypedNavigation} from "../../../../hooks/useTypedNavigation";

const ProfileFunctions = () => {
  const {navigate} = useTypedNavigation()

  return (
    <View className='flex flex-col h-auto gap-2 w-auto'>
      <Pressable
        className='flex flex-row items-center gap-2'
        onPress={() => navigate('OrderHistory')}
      >
        <Svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <Path d="M8.69473 0.0855487C9.12611 0.0287562 9.5621 0 10 0C10.0004 0 10.0009 8.22708e-08 10.0013 8.22708e-08C10.006 6.85588e-07 10.0107 4.60711e-06 10.0154 1.18459e-05C10.4481 0.000677818 10.8789 0.0294215 11.3053 0.0855483C12.1698 0.199373 13.0177 0.426053 13.8268 0.7612C13.852 0.771607 13.877 0.782117 13.9021 0.792731C14.2778 0.951942 14.6445 1.13448 15 1.33975C15.7552 1.77577 16.4518 2.30965 17.0711 2.92893C17.9997 3.85752 18.7362 4.95991 19.2388 6.17317C19.7413 7.38642 20 8.68678 20 10C20 11.3132 19.7413 12.6136 19.2388 13.8268C18.7362 15.0401 17.9997 16.1425 17.0711 17.0711C16.4518 17.6903 15.7552 18.2242 15 18.6603C14.6208 18.8792 14.2288 19.0723 13.8268 19.2388C13.0177 19.5739 12.1698 19.8006 11.3053 19.9145C10.8739 19.9712 10.4379 20 10 20C9.5621 20 9.12611 19.9712 8.69474 19.9145L8.95579 17.9316C9.30088 17.977 9.64967 18 10 18C10.3503 18 10.6991 17.977 11.0442 17.9316C11.7359 17.8405 12.4142 17.6592 13.0615 17.391C13.383 17.2578 13.6966 17.1034 14 16.9282C14.6042 16.5794 15.1614 16.1523 15.6569 15.6569C16.3997 14.914 16.989 14.0321 17.391 13.0615C17.7931 12.0909 18 11.0506 18 10C18 8.94942 17.7931 7.90914 17.391 6.93853C16.989 5.96793 16.3997 5.08601 15.6569 4.34315C15.1614 3.84772 14.6042 3.42062 14 3.0718C13.6966 2.89663 13.383 2.74216 13.0615 2.60896C12.4142 2.34084 11.7359 2.1595 11.0442 2.06844C10.6991 2.02301 10.3503 2 10 2C9.64966 2 9.30088 2.02301 8.95579 2.06844L8.69473 0.0855487Z" fill="#1B9F01"/>
          <Path d="M6.17317 0.761201C5.77119 0.927705 5.37923 1.1208 5 1.33975C4.62077 1.5587 4.25757 1.80159 3.91238 2.06647L5.12991 3.65317C5.40605 3.44128 5.6966 3.24696 6 3.0718C6.3034 2.89663 6.61696 2.74216 6.93853 2.60896L6.17317 0.761201Z" fill="#1B9F01"/>
          <Path d="M1.33975 5C1.5587 4.62077 1.80159 4.25757 2.06646 3.91238L3.65317 5.12991C3.44128 5.40605 3.24696 5.6966 3.0718 6C2.89663 6.3034 2.74216 6.61696 2.60896 6.93853L0.7612 6.17317C0.927704 5.77119 1.12079 5.37924 1.33975 5Z" fill="#1B9F01"/>
          <Path d="M0.0855483 8.69474C0.028756 9.12611 0 9.5621 0 10C0 10.4379 0.0287563 10.8739 0.0855488 11.3053L2.06844 11.0442C2.02301 10.6991 2 10.3503 2 10C2 9.64967 2.02301 9.30088 2.06844 8.95579L0.0855483 8.69474Z" fill="#1B9F01"/>
          <Path d="M1.33975 15C1.1208 14.6208 0.927706 14.2288 0.761202 13.8268L2.60896 13.0615C2.74216 13.383 2.89663 13.6966 3.0718 14C3.24697 14.3034 3.44128 14.594 3.65317 14.8701L2.06647 16.0876C1.8016 15.7424 1.5587 15.3792 1.33975 15Z" fill="#1B9F01"/>
          <Path d="M3.91238 17.9335C4.25757 18.1984 4.62077 18.4413 5 18.6603C5.37924 18.8792 5.77119 19.0723 6.17317 19.2388L6.93853 17.391C6.61696 17.2578 6.3034 17.1034 6 16.9282C5.6966 16.753 5.40605 16.5587 5.12991 16.3468L3.91238 17.9335Z" fill="#1B9F01"/>
          <Path d="M9 10V5H11V9.58579L14.2071 12.7929L12.7929 14.2071L9.29289 10.7071C9.10536 10.5196 9 10.2652 9 10Z" fill="#1B9F01"/>
        </Svg>
        <Text className="text-black text-lg font-semibold w-auto">История заказов</Text>
      </Pressable>
      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() => {
          navigate("ProfileLeaveModal")
        }}
      >
        <Svg width="18" height="18" viewBox="0 0 18 20" fill="none">
          <Path fillRule="evenodd" clipRule="evenodd" d="M1 0H16V2H3.85078L6.62469 4.21913C6.86191 4.4089 7 4.69622 7 5V16H16V18H7V19C7 19.3844 6.77965 19.7348 6.43319 19.9013C6.08672 20.0678 5.67548 20.021 5.37531 19.7809L0.375305 15.7809C0.13809 15.5911 0 15.3038 0 15V1C0 0.447715 0.447716 0 1 0ZM5 5.48062L2 3.08062V14.5194L5 16.9194V5.48062Z" fill="#1B9F01"/>
          <Path d="M17.7071 9.70706C17.8946 9.51952 18 9.26517 18 8.99995C18 8.73474 17.8946 8.48038 17.7071 8.29285L13.7071 4.29285L12.2929 5.70706L14.5858 7.99995L9 8V10L14.5858 9.99995L12.2929 12.2928L13.7071 13.7071L17.7071 9.70706Z" fill="#1B9F01"/>
        </Svg>
        <Text className="text-black text-lg font-semibold w-auto">Выйти из профиля</Text>
      </Pressable>
    </View>
  )
}

export default ProfileFunctions