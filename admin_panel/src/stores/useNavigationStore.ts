import {create} from 'zustand'

export enum Navigations {
  branchsPage = 'branchsPage',
  productsPage = 'productsPage',
  ordersPage = 'ordersPage',
  usersPage = 'usersPage',
  statisticsPage = 'statisticsPage',
  settingsPage = 'settingsPage',
  categoriesPage = 'categoriesPage',
  subCategoriesPage = 'subCategoriesPage',
  curiersPage = 'curiersPage',
  citiesPage = 'citiesPage',
  homePage = 'homePage',
}

export type LoginData = {
  login: string
  hashedPassword: string
}

type Values = {
  navigation: Navigations
  loginData: LoginData
  isLogined: boolean
}

type Actions = {
  setNavigation: (navigation: Navigations) => void
  setLoginData: (loginData: LoginData) => void
  setIsLogined: (isLogined: boolean) => void
}

export const useNavigationStore = create<Values & Actions>((set) => ({
  loginData: {
    login: '',
    hashedPassword: '',
  },
  isLogined: false,
  setIsLogined: (isLogined) => set(() => ({isLogined})),
  setLoginData: (loginData) => set(() => ({loginData})),
  navigation: Navigations.homePage,
  setNavigation: (navigation) => set(() => ({navigation})),
}))
