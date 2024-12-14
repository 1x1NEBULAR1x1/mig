import axios from "axios";
import {url} from "./url.ts";
import {UserRead} from "../models.ts";

export const getCodes = async () => {
  return await axios.get(url + '/admin/codes', {withCredentials: true}).then(data => data.data)
}

export const getUsers = async (): Promise<UserRead[]> => {
  const {data, status} = await axios.get<UserRead[]>(url + '/admin/users', {withCredentials: true})
  if (status !== 200) {
    return []
  }
  return data
}

export const updateUser = async (user: UserRead) => {
  const {status} = await axios.put(url + '/admin/update_user', user, {withCredentials: true})
  if (status !== 200) {
    return
  }
}

export const getUser = async (id: number) => {
  const {data, status} = await axios.get<UserRead>(url + `/admin/user/${id}`, {withCredentials: true})
  if (status !== 200) {
    return
  }
  return data
}