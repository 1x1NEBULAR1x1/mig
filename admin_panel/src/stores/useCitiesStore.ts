import {create} from 'zustand'
import {CityCreate, CityRead} from "../models.ts";

type Values = {
  cities: CityRead[]
  city: CityRead | undefined
  cityCreate: CityCreate
  cityUpdate: CityRead | undefined
  isUpdateSuccess: boolean
  isCreateSuccess: boolean
}

type Actions = {
  setCities: (cities: CityRead[]) => void
  setCityCreate: (city: CityCreate | undefined) => void
  setCityUpdate: (city: CityRead | undefined) => void
  setIsUpdateSuccess: (isUpdateSuccess: boolean) => void
  setIsCreateSuccess: (isCreateSuccess: boolean) => void
  setCity: (city: CityRead | undefined) => void
}

export const useCitiesStore = create<Values & Actions>((set) => ({
  cities: [],
  cityCreate: {name: '', isAvailable: true},
  cityUpdate: undefined,
  isUpdateSuccess: false,
  isCreateSuccess: false,
  city: undefined,
  setCity: (city) => set(() => ({city: city})),
  setIsUpdateSuccess: (isUpdateSuccess) => set(() => ({isUpdateSuccess})),
  setIsCreateSuccess: (isCreateSuccess) => set(() => ({isCreateSuccess})),
  setCityCreate: (city) => set(() => ({cityCreate: city, isCreateSuccess: false, isUpdateSuccess: false})),
  setCityUpdate: (city) => set(() => ({cityUpdate: city, isCreateSuccess: false, isUpdateSuccess: false})),
  setCities: (cities) => set(() => ({cities})),
}))
