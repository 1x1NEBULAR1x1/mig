import { IRoute } from "./navigation.types"
import Home from "../app/components/screens/home/Home"
import Cart from "../app/components/screens/cart/Cart";
import Profile from "../app/components/screens/profile/Profile";
import SelectCategory from "../app/components/screens/home/SelectCategory";
import Category from "../app/components/screens/home/Category";
import ProductScreen from "../app/components/screens/productScreen/ProductScreen";
import Payment from "../app/components/screens/payment/Payment";
import OrderView from "../app/components/screens/order/OrderView";
import OrderHistory from "../app/components/screens/orderHistory/OrderHistory";
import ProfileLeaveModal from "../app/components/screens/profile/ProfileLeaveModal";
import OrderHistoryView from "../app/components/screens/orderHistory/OrderHistoryView";
import SubCategoryList from "../app/components/screens/home/SubCategoryList";
import SubCategoryScreen from "../app/components/screens/home/SubCategoryScreen";
import PaymentConfirm from "../app/components/screens/payment/PaymentConfirm";
import PaymenSuccessScreen from "../app/components/screens/PaymenSuccessScreen";
import Map from "../app/components/screens/Map";

export const routes: IRoute[] = [
  {
    name: 'Home',
    component: Home,
  },
  {
    name: 'Cart',
    component: Cart
  },
  {
    name: 'Profile',
    component: Profile
  },
  {
    name: 'SelectCategory',
    component: SelectCategory,
  },
  {
    name: 'Category',
    component: Category
  },
  {
    name: 'ProductScreen',
    component: ProductScreen
  },
  {
    name: 'Payment',
    component: Payment
  },
  {
    name: 'Order',
    component: OrderView
  },
  {
    name: 'OrderHistory',
    component: OrderHistory
  },
  {
    name: 'ProfileLeaveModal',
    component: ProfileLeaveModal
  },
  {
    name: 'OrderHistoryView',
    component: OrderHistoryView
  },
  {
    name: 'SubCategoryList',
    component: SubCategoryList
  },
  {
    name: 'SubCategoryScreen',
    component: SubCategoryScreen
  },
  {
    name: 'PaymentConfirm',
    component: PaymentConfirm
  },
  {
    name: 'PaymenSuccessScreen',
    component: PaymenSuccessScreen
  },
  {
    name: 'Map',
    component: Map
  }
]