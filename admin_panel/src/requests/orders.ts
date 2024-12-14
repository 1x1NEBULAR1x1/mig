import axios from "axios";
import {url} from "./url.ts";
import {OrderPriorityRead, OrderRead, OrderStatusRead, OrderUpdate} from "../models.ts";


export const getOrders = async () => {
  return await axios.get<OrderRead[]>(url + "/admin/orders", {withCredentials: true}).then(data => data.data)
}

export const updateOrder = async (order: OrderUpdate) => {
  return await axios.put<OrderRead>(url + '/admin/order', order, {withCredentials: true}).then(data => data.data)
}

export const getPriorities = async () => {
  return await axios.get<OrderPriorityRead[]>(url + '/admin/order_priorities', {withCredentials: true}).then(data => data.data)
}

export const getStatuses = async () => {
  return await axios.get<OrderStatusRead[]>(url + '/admin/order_statuses', {withCredentials: true}).then(data => data.data)
}