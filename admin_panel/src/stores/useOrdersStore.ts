import {create} from 'zustand'
import {OrderPriorityRead, OrderRead, OrderStatusRead} from "../models.ts";

type Values = {
  orders: OrderRead[]
  order: OrderRead | undefined
  statuses: OrderStatusRead[]
  priorities: OrderPriorityRead[]
}

type Actions = {
  setOrders: (orders: OrderRead[]) => void
  setOrder: (order: OrderRead | undefined) => void
  setPriorities: (priorities: OrderPriorityRead[]) => void
  setStatuses: (statuses: OrderStatusRead[]) => void
}

export const useOrdersStore = create<Values & Actions>((set) => ({
  orders: [],
  order: undefined,
  priorities: [],
  statuses: [],
  setPriorities: (priorities) => set(() => ({priorities: priorities})),
  setStatuses: (statuses) => set(() => ({statuses: statuses})),
  setOrder: (order) => set(() => ({order: order})),
  setOrders: (orders) => set(() => ({orders: orders}))
}))
