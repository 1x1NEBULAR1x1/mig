import {Address, OrderCreate, OrderPriority} from "../types/models";
import {create} from "zustand";

type Values = {
  paymentMethod: string
  curierTips: string
  paymentResetPhone: boolean
  paymentPhoneInput: string
  paymentCode: boolean
  paymentCodeInput: string
  paymentCodeError: boolean
  orderStreet: string
  orderHouse: string
  orderApartment: string
  orderEntrance: string
  orderFloor: string
  orderFlat: string
  orderComment: string
  orderDeliveryPriority?: OrderPriority
  order?: OrderCreate
  latitude: number
  longtude: number
  selectedAddress?: Address
  isPaymentAcception: boolean
  orderTotalPrice: number
}

type Actions = {
  setOrder: (order: OrderCreate | undefined) => void
  setPaymentResetPhone: (paymentResetPhone: boolean) => void
  setPaymentMethod: (paymentMethod: string) => void
  setCurierTips: (curierTips: string) => void
  setPaymentPhoneInput: (paymentPhoneInput: string) => void
  setPaymentCode: (paymentCode: boolean) => void
  setPaymentCodeInput: (paymentCodeInput: string) => void
  setPaymentCodeError: (paymentCodError: boolean) => void
  setOrderStreet: (orderStreet: string) => void
  setOrderHouse: (orderHouse: string) => void
  setOrderApartment: (orderApartment: string) => void
  setOrderEntrance: (orderEntrance: string) => void
  setOrderFloor: (orderFloor: string) => void
  setOrderFlat: (orderFlat: string) => void
  setOrderComment: (orderComment: string) => void
  setOrderDeliveryPriority: (orderDeliveryPriority: OrderPriority | undefined) => void
  setLatitude: (latitude: number) => void
  setLongtude: (longtude: number) => void
  setSelectedAddress: (selectedAddress: Address | undefined) => void
  setIsPaymentAcception: (isPaymentAcception: boolean) => void
  clear: () => void
  setOrderTotalPrice: (orderTotalPrice: number) => void
}

export const useOrderStore = create<Values & Actions>((set) => ({
  paymentMethod: 'Перевод',
  curierTips: 'Без чая',
  paymentResetPhone: false,
  paymentPhoneInput: '',
  paymentCode: false,
  paymentCodeInput: '',
  paymentCodeError: false,
  orderStreet: '',
  orderHouse: '',
  orderApartment: '',
  orderEntrance: '',
  orderFloor: '',
  orderFlat: '',
  orderComment: '',
  orderDeliveryPriority: undefined,
  order: undefined,
  latitude: 0,
  longtude: 0,
  selectedAddress: undefined,
  isPaymentAcception: false,
  orderTotalPrice: 0,
  clear: () => set(() => ({
    paymentMethod: 'Перевод',
    curierTips: 'Без чая',
    paymentResetPhone: false,
    paymentPhoneInput: '',
    paymentCode: false,
    paymentCodeInput: '',
    paymentCodeError: false,
    orderStreet: '',
    orderHouse: '',
    orderApartment: '',
    orderEntrance: '',
    orderFloor: '',
    orderFlat: '',
    orderComment: '',
    orderDeliveryPriority: undefined,
    latitude: 0,
    longtude: 0,
    selectedAddress: undefined,
    order: undefined
  })),
  setOrderTotalPrice: (orderTotalPrice) => set(() => ({orderTotalPrice})),
  setIsPaymentAcception: (isPaymentAcception) => set(() => ({isPaymentAcception})),
  setSelectedAddress: (selectedAddress) => set(() => ({selectedAddress: selectedAddress})),
  setLatitude: (latitude) => set(() => ({latitude: latitude})),
  setLongtude: (longtude) => set(() => ({longtude: longtude})),
  setOrder: (order) => set(() => ({order: order})),
  setOrderStreet: (orderStreet) => set(() => ({ orderStreet: orderStreet })),
  setOrderHouse: (orderHouse) => set(() => ({ orderHouse: orderHouse })),
  setOrderApartment: (orderApartment) => set(() => ({ orderApartment: orderApartment })),
  setOrderEntrance: (orderEntrance) => set(() => ({ orderEntrance: orderEntrance })),
  setOrderFloor: (orderFloor) => set(() => ({ orderFloor: orderFloor })),
  setOrderFlat: (orderFlat) => set(() => ({ orderFlat: orderFlat })),
  setOrderComment: (orderComment) => set(() => ({ orderComment: orderComment })),
  setOrderDeliveryPriority: (orderDeliveryPriority) => set(() => ({ orderDeliveryPriority: orderDeliveryPriority })),
  setPaymentCodeError: (paymentCodeError) => set(() => ({paymentCodeError: paymentCodeError})),
  setPaymentCode: (paymentCode) => set(() => ({ paymentCode: paymentCode, paymentCodeError: false })),
  setPaymentCodeInput: (paymentCodeInput) => set(() => ({ paymentCodeInput: paymentCodeInput, paymentCodeError: false })),
  setPaymentPhoneInput: (paymentPhoneInput) => set(() => ({paymentPhoneInput: paymentPhoneInput})),
  setPaymentResetPhone: (paymentResetPhone) => set(() => ({paymentResetPhone: paymentResetPhone})),
  setPaymentMethod: (paymentMethod) => set(() => ({ paymentMethod: paymentMethod })),
  setCurierTips: (curierTips) => set(() => ({ curierTips: curierTips })),
}))