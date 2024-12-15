import { create } from 'zustand'
import {City} from "../types/models";


type Values = {
  cities: Array<City>
  matchedCities: Array<City>
  selectedCity?: City | undefined
  inputValue: string
  isLoaded: boolean
}


type Actions = {
  setCities: (cities: Array<City>) => void
  setMatchedCities: (matchedCities: Array<City>) => void
  setSelectedCity: (selectedCity: City | undefined) => void
  setIsLoaded: (isLoaded: boolean) => void
  resetSelectedCity: () => void
  setInputValue: (inputValue: string) => void
}

export const useCitiesStore = create<Values & Actions>((set) => ({
  cities: [{name: 'Москва', isAvailable: true, id: 1}, {name: 'Санкт-Петербург', isAvailable: true, id: 2},
    {name: 'Уфа', isAvailable: true, id: 3}, {name: 'Екатеринбург', isAvailable: false, id: 4},
    {name: 'Владивосток', isAvailable: false, id: 5}, {name: 'Тюмень', isAvailable: false, id: 6}],
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