import axios from "axios";
import {url} from "./url";
import {
  ProductRead,
  ProductCreate,
  ProductContainsCreate,
  ProductContainsUpdate,
  ProductTagCreate,
  ProductTagUpdate
} from "../models.ts";

export const updateProduct = async (product: ProductRead, file: File | undefined): Promise<ProductRead> => {
  const formData = new FormData();
  formData.append("id", product.id.toString())
  return sendRequest(product, file, formData, "update")
}

export const addProduct = async (product: ProductCreate, file: File | undefined): Promise<ProductRead> => {
  const formData = new FormData();
  return sendRequest(product, file, formData, "add")
}

const sendRequest = async (product: ProductCreate | ProductRead, file: File | undefined, formData: FormData, requestType: string): Promise<ProductRead> => {
  formData.append("name", product.name)
  formData.append("price", product.price.toString())
  formData.append("description", product.description)
  formData.append('expiration', product.expiration)
  if (file) {
    formData.append("image_file", file)
  }
  formData.append("sub_category_id", product.subCategoryId.toString())
  formData.append("manufacturer", product.manufacturer)
  if (product.previousPrice) {
    formData.append("previous_price", product.previousPrice.toString())
  } else {
    formData.append("previous_price", "")
  }
  formData.append("storage", product.storage)
  formData.append("units_of_measure", product.unitsOfMeasure)
  formData.append("compound", product.compound)
  formData.append("amount", product.amount.toString())
  formData.append("is_available", product.isAvailable?.toString() || 'true')
  let tags
  let contains
  if (requestType === 'add') {
    tags = product.tags
    contains = product.contains
  }

  if (requestType === 'update') {
    return  await axios.put(url + `/admin/product`, formData, {withCredentials: true}).then(data => data.data)
  } else {
    let product
    product =  await axios.post(url + `/admin/product`, formData, {withCredentials: true}).then(data => data.data)
    for (const tag of tags!) {
      product = await addTag({...tag, productId: product.id})
    }
    for (const contain of contains!) {
      product = await addContains({name: contain.name!, amount: contain.amount!, productId: product.id})
    }
    return product
  }
}

export const addContains = async (productContains: ProductContainsCreate) => {
  return await axios.post(url + `/admin/product_contains`, productContains, {withCredentials: true}).then((data => data.data))
}

export const updateContains = async (productContains: ProductContainsUpdate) => {
  return await axios.put(url + `/admin/product_contains`, productContains, {withCredentials: true}).then(data => data.data)
}

export const deleteContains = async (id: number): Promise<ProductRead> => {
  return await axios.delete(url + `/admin/product_contains/?id=${id}`, {withCredentials: true}).then(data => data.data)
}

export const getProduct = async (id: number): Promise<ProductRead> => {
  return await axios.get<ProductRead>(url + `/product/?id=${id}`, {withCredentials: true}).then(data => data.data)
}

export const addTag = async (tag: ProductTagCreate): Promise<ProductRead> => {
  return await axios.post<ProductRead>(url + '/admin/product_tag', tag, {withCredentials: true}).then(data => data.data)
}

export const updateTag = async (tag: ProductTagUpdate): Promise<ProductRead> => {
  return await axios.put<ProductRead>(url + "/admin/product_tag", tag, {withCredentials: true}).then(data => data.data)
}

export const deleteTag = async (id: number): Promise<ProductRead> => {
  return await axios.delete<ProductRead>(url + "/admin/product_tag/?id="+id, {withCredentials: true}).then(data => data.data)
}
