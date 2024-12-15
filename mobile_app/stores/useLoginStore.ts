import {create} from "zustand";

type Values = {
  phoneNumber: string
  code: string
  isCodeError: boolean
  isLoading: boolean
  isSignUp: boolean
  isVerifying: boolean
}

type Actions = {
  setPhoneNumber: (phoneNumber: string) => void
  setCode: (code: string) => void
  setIsCodeError: (isCodeError: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  setIsSignUp: (isSignUp: boolean) => void
  setIsVerifying: (isVerifying: boolean) => void
}

export const useLoginStore = create<Values & Actions>((set) => ({
  phoneNumber: '',
  code: '',
  isCodeError: false,
  isLoading: false,
  isSignUp: false,
  isVerifying: false,

  setIsVerifying: (isVerifying: boolean) => set({isVerifying}),
  setIsSignUp: (isSignUp: boolean) => set({isSignUp}),
  setPhoneNumber: (phoneNumber: string) => set({phoneNumber}),
  setCode: (code: string) => set({code}),
  setIsCodeError: (isCodeError: boolean) => set({isCodeError}),
  setIsLoading: (isLoading: boolean) => set({isLoading}),
}))