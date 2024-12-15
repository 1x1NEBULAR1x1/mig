import {View} from "react-native"
import Svg, {Path} from "react-native-svg";
import {Order} from "../../../../types/models";
import {FC} from "react";

interface IOrderStatusBar {
  order: Order
}

const OrderStatusBar: FC<IOrderStatusBar> = ({order}) => {
  return (
    <View className="w-full bg-[#EEEFF3] rounded-2xl h-auto flex p-2 flex-row gap-2 justify-evenly items-center">
      <View className={`w-12 flex justify-center items-center h-12 rounded-full bg-[${order.status.id >= 1 ? '#1B9F01' : '#FFFFFF'}]`}>
        <Svg width="14" height="14" viewBox="0 0 18 14">
          <Path fillRule="evenodd" clipRule="evenodd" d="M17.4572 2.3107L6.95718 12.8107C6.56666 13.2012 5.93349 13.2012 5.54297 12.8107L0.542969 7.8107L1.95718 6.39648L6.25008 10.6894L16.043 0.896484L17.4572 2.3107Z" fill={order.status.id >= 1 ? '#FFFFFF' : '#BDBFC9'}/>
        </Svg>
      </View>
      <View className={`w-2 h-[1px] bg-[${order.status.id >= 1 ? '#1B9F01' : '#BDBFC9'}]`}></View>
      <View
        className={`w-12 flex justify-center items-center h-12 rounded-full bg-[${order.status.id >= 2 ? '#1B9F01' : '#FFFFFF'}]`}>
        <Svg width="14" height="14" viewBox="0 0 24 20">
          <Path d="M8.66699 6V10H10.667V6H8.66699Z" fill={order.status.id >= 2 ? '#FFFFFF' : '#BDBFC9'}/>
          <Path d="M12.667 10V6H14.667V10H12.667Z" fill={order.status.id >= 2 ? '#FFFFFF' : '#BDBFC9'}/>
          <Path d="M16.667 6V10H18.667V6H16.667Z" fill={order.status.id >= 2 ? '#FFFFFF' : '#BDBFC9'}/>
          <Path fillRule="evenodd" clipRule="evenodd" fill={order.status.id >= 2 ? '#FFFFFF' : '#BDBFC9'} d="M0.666992 0H3.04896C3.8065 0 4.49903 0.428004 4.83781 1.10557L5.28503 2H21.4472C22.7093 2 23.6559 3.15465 23.4083 4.39223L21.9691 11.5883C21.6887 12.9904 20.4581 14 19.0278 14H6.66699C6.11471 14 5.66699 14.4477 5.66699 15C5.66699 15.5523 6.11471 16 6.66699 16H21.667V18H20.5816C20.6369 18.1564 20.667 18.3247 20.667 18.5C20.667 19.3284 19.9954 20 19.167 20C18.3386 20 17.667 19.3284 17.667 18.5C17.667 18.3247 17.6971 18.1564 17.7523 18H8.58164C8.63692 18.1564 8.66699 18.3247 8.66699 18.5C8.66699 19.3284 7.99542 20 7.16699 20C6.33856 20 5.66699 19.3284 5.66699 18.5C5.66699 18.2765 5.71587 18.0644 5.80352 17.8739C4.56756 17.503 3.66699 16.3567 3.66699 15C3.66699 13.7591 4.42039 12.6942 5.49472 12.2377L3.71268 3.32743L3.04896 2H0.666992V0ZM5.8868 4L7.4868 12H19.0278C19.5042 12 19.9144 11.6638 20.008 11.1961L21.4472 4H5.8868Z"/>
        </Svg>
      </View>
      <View className={`w-2 h-[1px] bg-[${order.status.id >= 2 ? '#1B9F01' : '#BDBFC9'}]`}></View>
      <View className={`w-12 flex justify-center items-center h-12 rounded-full bg-[${order.status.id >= 3 ? '#1B9F01' : '#FFFFFF'}]`}>
        <Svg width="14" height="14" viewBox="0 0 21 22">
          <Path fillRule="evenodd" clipRule="evenodd" fill={order.status.id >= 3 ? '#FFFFFF' : '#BDBFC9'} d="M12.333 0C15.0944 0 17.333 2.23858 17.333 5C17.333 7.76142 15.0944 10 12.333 10C9.57158 10 7.33301 7.76142 7.33301 5C7.33301 2.23858 9.57158 0 12.333 0ZM15.333 5C15.333 3.34315 13.9899 2 12.333 2C10.6762 2 9.33301 3.34315 9.33301 5C9.33301 6.65685 10.6762 8 12.333 8C13.9899 8 15.333 6.65685 15.333 5Z"/>
          <Path fill={order.status.id >= 3 ? '#FFFFFF' : '#BDBFC9'} d="M11.8329 11C17.2433 11 20.333 15.5983 20.333 20H18.333C18.333 16.4017 15.8599 13 11.8329 13C10.7726 13 9.83929 13.2294 9.0354 13.6215L8.25146 11.7794C9.30834 11.2808 10.5102 11 11.8329 11Z"/>
          <Path fill={order.status.id >= 3 ? '#FFFFFF' : '#BDBFC9'} d="M0.333008 18H5.91887L3.62598 20.2929L5.04019 21.7071L9.04019 17.7071C9.43071 17.3166 9.43071 16.6834 9.04019 16.2929L5.04019 12.2929L3.62598 13.7071L5.91887 16H0.333008V18Z"/>
        </Svg>
      </View>
      <View className={`w-2 h-[1px] bg-[${order.status.id >= 3 ? '#1B9F01' : '#BDBFC9'}]`}></View>
      <View
        className={`w-12 flex justify-center items-center h-12 rounded-full bg-[${order.status.id >= 4 ? '#1B9F01' : '#FFFFFF'}]`}>
        <Svg width="14" height="14" viewBox="0 0 22 15">
          <Path fillRule="evenodd" clipRule="evenodd" fill={order.status.id >= 4 ? '#FFFFFF' : '#BDBFC9'} d="M16 0H13V2H15.4648L16.2582 3.19015C13.9957 3.69252 12.0937 5.15302 11 7.12399C9.63527 4.66458 7.01203 3 4 3H2V5H4C5.29585 5 6.49576 5.41081 7.47659 6.10929L6.03202 7.55385C5.4365 7.20194 4.74183 7 4 7C1.79086 7 0 8.79086 0 11C0 13.2091 1.79086 15 4 15C6.20914 15 8 13.2091 8 11C8 10.2582 7.79808 9.56359 7.44621 8.96809L8.89079 7.52352C9.58922 8.50433 10 9.70419 10 11C10 11.5523 10.4477 12 11 12C11.5523 12 12 11.5523 12 11C12 9.70419 12.4108 8.50433 13.1092 7.52352L14.5538 8.96809C14.2019 9.56359 14 10.2582 14 11C14 13.2091 15.7909 15 18 15C20.2091 15 22 13.2091 22 11C22 8.79086 20.2091 7 18 7C17.2582 7 16.5635 7.20194 15.968 7.55385L14.5234 6.10929C15.5042 5.41081 16.7041 5 18 5C18.3688 5 18.7077 4.79702 18.8817 4.47186C19.0557 4.1467 19.0366 3.75216 18.8321 3.4453L16.8321 0.4453C16.6466 0.167101 16.3344 0 16 0ZM4 9C2.89543 9 2 9.89543 2 11C2 12.1046 2.89543 13 4 13C5.10457 13 6 12.1046 6 11C6 9.89543 5.10457 9 4 9ZM18 9C16.8954 9 16 9.89543 16 11C16 12.1046 16.8954 13 18 13C19.1046 13 20 12.1046 20 11C20 9.89543 19.1046 9 18 9Z"/>
        </Svg>
      </View>
    </View>
  )
}

export default OrderStatusBar