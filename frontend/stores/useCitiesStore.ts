import { create } from 'zustand'
import {City} from "../types/models.ts";


type Values = {
  cities: Array<City>
  matchedCities: Array<City>
  selectedCity?: City
  inputValue: string
  isLoaded: boolean
}


type Actions = {
  setCities: (cities: Array<City>) => void
  setMatchedCities: (matchedCities: Array<City>) => void
  setSelectedCity: (selectedCity: City) => void
  setIsLoaded: (isLoaded: boolean) => void
  resetSelectedCity: () => void
  setInputValue: (inputValue: string) => void
}

export const useCitiesStore = create<Values & Actions>((set) => ({
  cities: [],
  matchedCities: [],
  inputValue: '',
  isLoaded: false,
  isFound: false,
  resetSelectedCity: () => set(() => ({ selectedCity: undefined })),
  setMatchedCities: (matchedCities) => set(() => ({ matchedCities: matchedCities })),
  setCities: (cities) => set(() => ({ cities: cities })),
  setSelectedCity: (selectedCity) => set(() => ({ selectedCity: selectedCity })),
  setIsLoaded: (isLoaded) => set(() => ({ isLoaded: isLoaded })),
  setInputValue: (inputValue) => set(() => ({ inputValue: inputValue })),
}))