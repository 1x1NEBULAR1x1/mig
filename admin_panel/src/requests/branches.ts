import {url, yandexApiKey} from './url'
import axios from "axios";
import {
  BranchAddressUpdate,
  BranchCreate,
  BranchUpdate,
  BranchCategory,
  BranchProduct, BranchProductRead, BranchProductUpdate, BranchRead, BranchAddressCreate
} from "../models.ts";

const getCoordinates = async (address: string): Promise<[number, number] | undefined> => {
    try {
      const res = await axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${yandexApiKey}&geocode=${encodeURIComponent(address)}`);
      const point = res.data.response.GeoObjectCollection.featureMember[0]?.GeoObject.Point.pos;

      if (point) {
        const [longitude, latitude] = point.split(" ");
        if (latitude && longitude) {
          return [latitude, longitude];
        }
      }
    } catch{console.log('')}
  };


export const updateBranchAddress = async (branchAddress: BranchAddressUpdate, cityName: string) => {
  const coordinates = await getCoordinates(`${cityName} ${branchAddress.street} ${branchAddress.house}`)
  return await axios.put(url + '/admin/branch_address', {...branchAddress, latitude: coordinates?.[0] || 0, longitude: coordinates?.[1] || 0}, {withCredentials: true})
}

export const updateBranch = async (branch: BranchUpdate, cityName: string) => {
  const coordinates = await getCoordinates(`${cityName} ${branch.address?.street} ${branch.address?.house}`)
  return await axios.put<BranchRead>(url + '/admin/branch', {...branch, address: {...branch.address, latitude: coordinates?.[0] || 0, longitude: coordinates?.[1] || 0}}, {withCredentials: true})
}

export const addBranch = async (branch: BranchCreate, cityName: string) => {
  const coordinates = await getCoordinates(`${cityName} ${branch.address.street} ${branch.address.house}`)
  return await axios.post(url + '/admin/branch', {...branch, address: {...branch.address, latitude: coordinates?.[0] || 0, longitude: coordinates?.[1] || 0}}, {withCredentials: true})
}

export const addAddress = async (address: BranchAddressCreate) => {
  return await axios.post(url + '/admin/branch_address', address, {withCredentials: true})
}

export const getBranchCatalog = async (btanchId: number): Promise<BranchCategory[]> => {
  return await axios.get<BranchCategory[]>(url + `/admin/branch/${btanchId}/catalog`, {withCredentials: true}).then(data => data.data)
}

export const addBranchProduct = async (branchId: number, product: BranchProduct) => {
  return await axios.post(url + `/admin/branch/${branchId}/product`, {product_id: product.product.id, amount: product.amount, is_available: product.is_available}, {withCredentials: true})
}

export const getBranchProduct = async (branchProductId: number): Promise<BranchProductRead> => {
  return await axios.get<BranchProductRead>(url + `/admin/branch_product/${branchProductId}`, {withCredentials: true}).then(data => data.data)
}

export const updateBranchProduct = async (product: BranchProductUpdate): Promise<BranchProductRead> => {
  return await axios.put<BranchProductRead>(url + `/admin/branch_product`, product, {withCredentials: true}).then(data => data.data)
}

export const deleteBranchProduct = async (branchProductId: number): Promise<BranchProductRead> => {
  return await axios.delete<BranchProductRead>(url + `/admin/branch_product/${branchProductId}`, {withCredentials: true}).then(data => data.data)
}