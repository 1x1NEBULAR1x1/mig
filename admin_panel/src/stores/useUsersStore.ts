import {create} from 'zustand'
import {UserRead} from "../models.ts";

type Values = {
  users: UserRead[]
  user?: UserRead
  isUpdateSuccess: boolean
}

type Actions = {
  setUser: (user: UserRead | undefined) => void
  setUsers: (users: UserRead[]) => void
  setIsUpdateSuccess: (isUpdateSuccess: boolean) => void
}

export const useUsersStore = create<Values & Actions>((set) => ({
  users: [],
  user: undefined,
  isUpdateSuccess: false,
  setUser: (user) => set({user: user, isUpdateSuccess: false}),
  setUsers: (users) => set(() => ({users: users, isUpdateSuccess: false})),
  setIsUpdateSuccess: (isUpdateSuccess) => set(() => ({isUpdateSuccess: isUpdateSuccess})),
}))
