import axios from "axios";
import {CategoryRead, SearchCreate, SearchUpdate, SubCatgeoryCreate, SubCatgeoryUpdate} from "../models.ts";
import {url} from "./url";

export const getCategories = async (): Promise<CategoryRead[]> => {
  const {data, status} = await axios.get<CategoryRead[]>(url + '/categories')
  if (status !== 200) {
    return []
  }
  return data
}

export const updateCategory = async (category: CategoryRead): Promise<CategoryRead> => {
  const {data, status} = await axios.put<CategoryRead>(url + '/admin/update_category', category, {withCredentials: true})
  if (status !== 200) {
    return category
  }
  return data
}

export const addSearch = async (search: SearchCreate): Promise<CategoryRead | undefined> => {
  const {data, status} = await axios.post<CategoryRead>(url + '/admin/add_search', search, {withCredentials: true})
  if (status === 200) {
    return data
  }
}


export const updateSearch = async (search: SearchUpdate): Promise<CategoryRead | undefined> => {
  const {data, status} = await axios.put<CategoryRead>(url + '/admin/update_search', search, {withCredentials: true})
  if (status === 200) {
    return data
  }
}

export const deleteSearch = async (searchId: number): Promise<CategoryRead | undefined> => {
  const {data, status} = await axios.delete<CategoryRead>(url + '/admin/delete_search/?search_id='+searchId, {withCredentials: true})
  if (status === 200) {
    return data
  }
}

export const updateSubCategory = async (subCategory: SubCatgeoryUpdate, file: File | undefined): Promise<CategoryRead> => {
  const formData = new FormData()

  if (file) {
    formData.append('image_file', file)
  }
  formData.append('name', subCategory.name || '')
  formData.append('id', subCategory.id.toString())
  formData.append('is_available', subCategory.isAvailable?.toString() || '')

  const {data} = await axios.put<CategoryRead>(url + '/admin/update_sub_category', formData, {withCredentials: true, headers: {'Content-Type': 'multipart/form-data'}})
  return data
}

export const addSubCategory = async (subCategory: SubCatgeoryCreate, file: File | undefined): Promise<CategoryRead> => {
  const formData = new FormData()
  if (file) {
    formData.append('image_file', file)
  }
  formData.append('category_id', subCategory.categoryId.toString())
  formData.append('name', subCategory.name || '')
  formData.append('is_available', subCategory.isAvailable?.toString() || '')
  const {data} = await axios.post<CategoryRead>(url + '/admin/add_sub_category', formData, {withCredentials: true})
  return data
}

export const checkImage = async (name: string, host: string) => {
    const {status} = await axios.get(host + '/' + name, {withCredentials: true})
    if (status === 200) {
      return name
    }
    return ''
  }