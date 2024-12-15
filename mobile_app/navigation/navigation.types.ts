import React, {ComponentType, FunctionComponent} from "react";
import SupportButtons from "../app/components/screens/profile/SupportButtons";
import PaymenSuccessScreen from "../app/components/screens/PaymenSuccessScreen";

export type TypeRootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
  SelectCategory: undefined;
  Category: undefined;
  ProductScreen: undefined;
  Payment: undefined;
  OrderHistory: undefined;
  Order: undefined;
  ProfileLeaveModal: undefined;
  OrderHistoryView: undefined;
  SubCategoryList: undefined;
  SubCategoryScreen: undefined;
  PaymentConfirm: undefined;
  PaymenSuccessScreen: undefined;
  Map: undefined;
}


export interface IRoute {
  name: keyof TypeRootStackParamList;
  component: ComponentType | FunctionComponent<any>;
}