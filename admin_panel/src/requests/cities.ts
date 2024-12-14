import axios from 'axios'
import {CityCreate, CityRead, CityUpdate} from "../models.ts";
import {url} from './url.ts'

export const getCities = async (): Promise<CityRead[]> => {
  const {data, status} = await axios.get<CityRead[]>(url + '/cities')
  if (status !== 200) {
    return []
  }
  return data
}

export const addCity = async (city: CityCreate): Promise<CityRead | undefined> => {
  const {data, status} = await axios.post<CityRead>(url + '/admin/add_city/', city, {withCredentials: true})
  if (status !== 200) {
    return undefined
  }
  return data
}

export const updateCity = async (city: CityUpdate | undefined): Promise<CityRead | undefined> => {
  const {data, status} = await axios.put<CityRead>(url + '/admin/update_city/', city, {withCredentials: true})
  if (status !== 200) {
    return undefined
  }
  return data
}