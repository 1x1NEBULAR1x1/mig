import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { routes } from "./routes"
import { TypeRootStackParamList } from "./navigation.types"
import React from "react"
import BottomMenu from "../app/components/bottomMenu/BottomMenu";
import { Suspense, lazy } from 'react';

const Stack = createNativeStackNavigator()

const Home = lazy(() => import('../app/components/screens/home/Home'))
const Cart = lazy(() => import('../app/components/screens/cart/Cart'))
const Profile = lazy(() => import('../app/components/screens/profile/Profile'))
const SelectCategory = lazy(() => import('../app/components/screens/home/SelectCategory'))
const Category = lazy(() => import('../app/components/screens/home/Category'))
const Product = lazy(() => import('../app/components/screens/home/Product'))
const Payment = lazy(() => import('../app/components/screens/payment/Payment'))
const OrderHistory = lazy(() => import('../app/components/screens/orderHistory/OrderHistory'))
const Order = lazy(() => import('../app/components/screens/order/OrderView'))
const ProfileLeaveModal = lazy(() => import('../app/components/screens/profile/ProfileLeaveModal'))
const OrderHistoryView = lazy(() => import('../app/components/screens/orderHistory/OrderHistoryView'))
const SubCategoryList = lazy(() => import('../app/components/screens/home/SubCategoryList'))
const SubCategoryScreen = lazy(() => import('../app/components/screens/home/SubCategoryScreen'))
const PaymentConfirm = lazy(() => import('../app/components/screens/payment/PaymentConfirm'))
const PaymenSuccessScreen = lazy(() => import('../app/components/screens/PaymenSuccessScreen'))
const Map = lazy(() => import('../app/components/screens/Map'))


const Navigation = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: '#ffffff'}}}>
          <Stack.Screen name={'Home'} component={Home}/>
          <Stack.Screen name={'Cart'} component={Cart}/>
          <Stack.Screen name={'Profile'} component={Profile}/>
          <Stack.Screen name={'SelectCategory'} component={SelectCategory}/>
          <Stack.Screen name={'Category'} component={Category}/>
          <Stack.Screen name={'Product'} component={Product}/>
          <Stack.Screen name={'Payment'} component={Payment}/>
          <Stack.Screen name={'OrderHistory'} component={OrderHistory}/>
          <Stack.Screen name={'Order'} component={Order}/>
          <Stack.Screen name={'ProfileLeaveModal'} component={ProfileLeaveModal}/>
          <Stack.Screen name={'OrderHistoryView'} component={OrderHistoryView}/>
          <Stack.Screen name={'SubCategoryList'} component={SubCategoryList}/>
          <Stack.Screen name={'SubCategoryScreen'} component={SubCategoryScreen}/>
          <Stack.Screen name={'PaymentConfirm'} component={PaymentConfirm}/>
          <Stack.Screen name={'PaymenSuccessScreen'} component={PaymenSuccessScreen}/>
          <Stack.Screen name={'Map'} component={Map}/>
        </Stack.Navigator>
        <BottomMenu/>
      </NavigationContainer>
    </>
  )
}

export default Navigation;