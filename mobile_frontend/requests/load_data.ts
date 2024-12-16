import {Category, City, Order, OrderCreate, OrderPriority, User} from "../types/models";
import axios, {AxiosResponse} from "axios";
import {AddressForDeliveryPrice} from "../hooks/useDeliveryPrice";

export const url = ''

export const yandexMapsApiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY

export const loadCities = async () => {
    return await axios.get<City[]>(url + '/cities').then(data => data.data)
}
const getCoordinates = async (address: string): Promise<[number, number] | undefined> => {
    try {
      const res = await axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${yandexMapsApiKey}&geocode=${encodeURIComponent(address)}`);
      const point = res.data.response.GeoObjectCollection.featureMember[0]?.GeoObject.Point.pos;

      if (point) {
        const [longitude, latitude] = point.split(" ");
        if (latitude && longitude) {
          return [latitude, longitude];
        }
      }
    } catch{console.log('')}
  };

export const getDeliveryPtice = async (address: AddressForDeliveryPrice) => {
  const coordinates = await getCoordinates(`${address.cityName} ${address.street} ${address.house}`)
  return await axios.get<{delivery_price: number}>(url + '/delivery_price/?lat=' + coordinates?.[0] + '&lon=' + coordinates?.[1] + '&city_name=' + address.cityName).then(data => data.data)
}

export const loadUser = async (token: string) => {
    return await axios.post<User>(url + '/user/get-me/?token=' + token, {withCredentials: true}).then(data => data.data)
}

export const checkPaymentStatus = async (orderId: number) => {
  return await axios.get( url + '/payment-status/?order_id=' + orderId)
}

export const loadTax = async (): Promise<AxiosResponse<{tax: number}>> => {
  return await axios.get<{tax: number}>(url + '/tax')
}


export const loadCatalog = async (id: number) => {
    const res = await axios.get(url + '/catalog/?city_id=' + id).then(data => data.data)
    return res as Category[]
}

export const loadOrders = async () => {
    const res = await axios.get(url + '/orders', {withCredentials: true}).then(data => data.data)
    return await res as Order[]
}

export const loadAccount = async () => {
    const {data, status} = await axios.get(url + '/user/protected/', {withCredentials: true})
    if (status === 200) {
        return data.phone_number
    }
}

export const loadOrderPriorities = async () => {
    const {data, status} = await axios.get(url + '/order_priorities')
    if (status === 200) {
        return data as OrderPriority[]
    }
}

export const requestOrder = async (order: OrderCreate): Promise<Order | undefined> => {
    const {data, status} = await axios.post<Order>(url + '/order', {
      ...order,
      priorityId: order.priority.id,
      curierTips: 0,
      products: order.products.map(product => ({productId: product.product.id, amount: product.amount}))
    }, {withCredentials: true})
    if (status === 200) {
        return data
    } else return undefined
}


export const sendVerificationCode = async (phone_number: string) => {
  return await axios.post(url + '/user/send-verification-code/?phone_number=' + phone_number, {}, {withCredentials: true})
}

export const checkVerificationCode = async (phone_number: string, code: string) => {
  return await axios.post(url + '/user/verify-phone/', {phone_number: phone_number, verify_code: parseInt(code)}, {withCredentials: true})
}
