import axios from "axios";
import {
  OrderPriorityCreate,
  OrderPriorityRead,
  OrderPriorityUpdate,
  OrderStatusRead,
  OrderStatusUpdate
} from "../models";
import {url} from "./url";

export const getTax = async () => {
  return await axios.get<{tax: number}>(url + '/tax').then(data => data.data)
}

export const updateTax = async (tax: number) => {
  return await axios.put<{tax: number}>(url + '/admin/tax?tax=' + tax, {}, {withCredentials: true}).then(data => data.data.tax)
}

export const getDeliveryPrice = async () => {
  return await axios.get<{start_price: number, cost_per_100m: number}>(url + '/admin/delivery_price', {withCredentials: true}).then(data => data.data)
}

export const updateOrderPriority = async (priority: OrderPriorityUpdate) => {
  return await axios.put<OrderPriorityRead>(url + '/admin/order_priority', priority, {withCredentials: true}).then(data => data.data)
}

export const addOrderPriority = async (priority: OrderPriorityCreate) => {
  return await axios.post(url + '/admin/order_priority', priority, {withCredentials: true}).then(data => data.data)
}

export const getOrderPriorities = async () => {
  return await axios.get<{priorities: OrderPriorityRead[]}>(url + '/admin/order_priorities', {withCredentials: true}).then(data => data.data.priorities)
}

export const updateDeliveryPrice = async (start_price: number, cost_per_100m: number) => {
  return await axios.put<{start_price: number, cost_per_100m: number}>(url + '/admin/delivery_price?start_price=' + start_price + '&cost_per_100m=' + cost_per_100m, {}, {withCredentials: true}).then(data => data.data)
}

export const getStatuses = async () => {
  return await axios.get<OrderStatusRead[]>(url + '/admin/statuses', {withCredentials: true}).then(data => data.data)
}

export const updateStatus = async (status: OrderStatusUpdate) => {
  return await axios.put<OrderStatusRead>(url + '/admin/order_status', status, {withCredentials: true}).then(data => data.data)
}