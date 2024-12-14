import {create} from 'zustand'
import {
  OrderPriorityCreate,
  OrderPriorityRead,
  OrderPriorityUpdate,
  OrderStatusRead,
  OrderStatusUpdate
} from "../models.ts";

type Values = {
  priorities: OrderPriorityRead[]
  priority: OrderPriorityUpdate | undefined
  priorityAdd: OrderPriorityCreate | undefined
  statuses: OrderStatusRead[]
  status: OrderStatusUpdate | undefined
  tax: {tax: number} | undefined
  deliveryPrice: {start_price: number, cost_per_100m: number} | undefined
  isActionSuccess: boolean
}

type Actions = {
  setPriorities: (priorities: OrderPriorityRead[]) => void
  setPriority: (priority: OrderPriorityUpdate | undefined) => void
  setStatuses: (statuses: OrderStatusRead[]) => void
  setPriorityAdd: (priorityAdd: OrderPriorityCreate | undefined) => void
  setStatus: (status: OrderStatusUpdate | undefined) => void
  setTax: (tax: {tax: number} | undefined) => void
  setDeliveryPrice: (deliveryPrice: {start_price: number, cost_per_100m: number} | undefined) => void
  setActionSuccess: (isActionSuccess: boolean) => void
}

export const useSettingsStore = create<Values & Actions>((set) => ({
  priorities: [],
  priority: undefined,
  statuses: [],
  status: undefined,
  tax: undefined,
  deliveryPrice: undefined,
  priorityAdd: undefined,
  isActionSuccess: false,

  setActionSuccess: (isActionSuccess) => set({isActionSuccess: isActionSuccess}),

  setPriorityAdd: (priorityAdd) => set(
    {
      priorityAdd: priorityAdd,
      isActionSuccess: false,
      priority: undefined,
      status: undefined
    }
  ),
  setPriorities: (priorities) => set({priorities: priorities}),
  setPriority: (priority) => set(
    {
      priority: priority,
      priorityAdd: undefined,
      isActionSuccess: false,
      status: undefined
    }
  ),
  setStatuses: (statuses) => set({statuses: statuses}),
  setStatus: (status) => set(
    {
      status: status,
      priority: undefined,
      priorityAdd: undefined,
      isActionSuccess: false
    }
  ),
  setTax: (tax) => set({tax: tax}),
  setDeliveryPrice: (deliveryPrice) => set({deliveryPrice: deliveryPrice}),
}))
