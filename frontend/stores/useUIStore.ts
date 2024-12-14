import { create } from 'zustand'
import {type Category, SubCategory, CartProduct, Order, Product} from "../types/models";

type Values = {
  selectedCategory?: Category
  selectedSubCategory?: SubCategory
  selectedProduct?: CartProduct | undefined
  searchValue?: string
  isOrderPageOpen: boolean
  currentSubCategory?: SubCategory
  isProfileOpened: boolean
  isLoginModalOpened: boolean
  isVerifying?: boolean
  phoneNumber?: string
  isCodeError?: boolean
  isExiting?: boolean
  viewOrder?: Order
  viewHistory?: boolean
  viewOrderHistory?: Order
  isProductListOpened: boolean
  recomendations: Product[]
  paymentCheck: Order | undefined
  code: string
  isPaymentSuccess: boolean
  orderStatusChanged: Order | undefined
}

type Actions = {
  setViewOrderHistory: (order: Order | undefined) => void
  setViewOrder: (order: Order | undefined) => void
  setViewHistory: (viewHistory: boolean) => void
  setSelectedCategory: (selectedCategory: Category | undefined) => void
  setSelectedSubCategory: (selectedSubCategory: SubCategory) => void
  setCurrentSubCategory: (currentSubCategory: SubCategory) => void
  setSelectedProduct: (selectedProduct?: CartProduct) => void
  setSearchValue: (searchValue: string) => void
  setIsOrderPageOpen: (isOrderPageOpen: boolean) => void
  setIsProfileOpened: (isProfileOpened: boolean) => void
  setIsLoginModalOpened: (isLoginModalOpened: boolean) => void
  setIsVerifying: (isVerifying: boolean) => void
  setPhoneNumber: (phoneNumber: string) => void
  setIsCodeError: (isCodeError: boolean | undefined) => void
  setIsExiting: (isExiting: boolean | undefined) => void
  setIsProductListOpened: (isProductListOpened: boolean) => void
  setRecomendations: (recomendations: Product[]) => void
  setCode: (code: string) => void
  setPaymentCheck: (paymentCheck: Order | undefined) => void
  setIsPaymentSuccess: (isPaymentSuccess: boolean) => void
  setOrderStatusChanged: (orderStatusChanged: Order | undefined) => void
}

export const useUIStore = create<Values & Actions>((set) => ({
  searchValue: '',
  isOrderPageOpen: false,
  viewOrderHistory: undefined,
  viewOrder: undefined,
  viewHistory: false,
  selectedCategory: undefined,
  selectedSubCategory: undefined,
  selectedProduct: undefined,
  currentSubCategory: undefined,
  isSelectedProductOpened: false,
  isProfileOpened: false,
  isLoginModalOpened: false,
  isVeryfing: false,
  phoneNumber: '',
  isCodeError: false,
  isExiting: false,
  isProductListOpened: true,
  recomendations: [],
  code: '',
  paymentCheck: undefined,
  isPaymentSuccess: false,
  orderStatusChanged: undefined,
  setOrderStatusChanged: (orderStatusChanged) => set(() => ({ orderStatusChanged: orderStatusChanged })),
  setIsPaymentSuccess: (isPaymentSuccess) => set(() => ({ isPaymentSuccess: isPaymentSuccess })),
  setPaymentCheck: (paymentCheck) => set(() => ({ paymentCheck: paymentCheck })),
  setCode: (code) => set(() => ({ code: code })),
  setIsProductListOpened: (isProductListOpened) => set(() => ({ isProductListOpened: isProductListOpened })),
  setViewOrderHistory: (order) => set(() => ({ viewOrderHistory: order })),
  setViewOrder: (order) => set(() => ({ viewOrder: order, viewHistory: false })),
  setViewHistory: (viewHistory) => set(() => ({ viewHistory: viewHistory, viewOrder: undefined })),
  setIsExiting: (isExiting) => set(() => ({ isExiting: isExiting })),
  setIsCodeError: (isCodeError) => set(() => ({ isCodeError: isCodeError })),
  setPhoneNumber: (phoneNumber) => set(() => ({ phoneNumber: phoneNumber })),
  setIsVerifying: (isVerifying) => set(() => ({ isVerifying: isVerifying })),
  setCurrentSubCategory: (currentSubCategory) => set(() => ({ currentSubCategory: currentSubCategory })),
  setSearchValue: (searchValue) => set(() => ({ searchValue: searchValue })),
  setRecomendations: (recomendations) => set(() => ({ recomendations: recomendations })),
  setSelectedCategory: (selectedCategory) => set(() => (
    {
      selectedCategory: selectedCategory,
      isOrderPageOpen: false,
      viewOrder: undefined,
      viewHistory: false,
      isProfileOpened: false
    })),
  setSelectedSubCategory: (selectedSubCategory) => set(() => (
    {
      selectedSubCategory: selectedSubCategory,
      currentSubCategory: selectedSubCategory
    })),
  setSelectedProduct: (selectedProduct) => set(() => ({ selectedProduct: selectedProduct })),
  setIsOrderPageOpen: (isOrderPageOpen) => set(() => ({ isOrderPageOpen: isOrderPageOpen })),
  setIsProfileOpened: (isProfileOpened) => set(() => ({ isProfileOpened: isProfileOpened })),
  setIsLoginModalOpened: (isLoginModalOpened) => set(() => ({ isLoginModalOpened: isLoginModalOpened })),
}))