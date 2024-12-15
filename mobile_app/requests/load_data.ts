import {Category, City, Order, OrderCreate, OrderPriority, User} from "../types/models";
import axios, {AxiosResponse} from "axios";
import {AddressForDeliveryPrice} from "../hooks/useDeliveryPrice";

export const url = process.env.EXPO_PUBLIC_API_URL;

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
export const yandexMapsApiKey = process.env.EXPO_PUBLIC_YANDEX_MAPS_API_KEY;

export const cardNumber = process.env.EXPO_PUBLIC_CARD_NUMBER;

export const cardOwner = process.env.EXPO_PUBLIC_CARD_OWNER_FULL_NAME;

export const checkPaymentStatus = async (orderId: number) => {
  return await axios.get( url + '/payment-status/?order_id=' + orderId)
}

export const loadTax = async (): Promise<AxiosResponse<{tax: number}>> => {
  return await axios.get<{tax: number}>(url + '/tax') || {data: {tax: 0}}
}

export const loadCities = async () => {
    return  await axios.get<City[]>(url + '/cities')
}

export const loadCatalog = async (id: number) => {
    return await axios.get<Category[]>(url + '/catalog/?city_id=' + id)
}

export const loadUser = async (token: string) => {
    return await axios.post<User>(url + '/user/get-me/?token=' + token, {withCredentials: true})
}

export const loadOrders = async (userId: number) => {
  return  await axios.get<Order[]>(url + '/orders-mobile/?user_id=' + userId)
}

export const loadOrderPriorities = async () => {
    return  await axios.get<OrderPriority[]>(url + '/order_priorities')
}

export const addOrder = async (order: OrderCreate, token: string) => {
  const data = {
    ...order,
    priorityId: order.priority.id,
    totalPrice: order.totalPrice,
    curierTips: order.curierTips,
    products: order.products.map(product => (
      {
        productId: product.product.id,
        amount: product.amount
      }
    ))
  }
  return await axios.post<Order>(url + '/order-mobile/?token=' + token, data).then(data => data.data)
}


export const sendVerificationCode = async (phone_number: string) => {
  return await axios.post(url + '/user/send-verification-code/?phone_number=' + phone_number, {}, {withCredentials: true})
}

export const checkVerificationCodeMobile = async (phone_number: string, code: string) => {
  return await axios.post<{access_token: string}>(url + '/user/verify-phone-mobile/?phone_number=' + phone_number + '&code=' + code)
}

export const getDeliveryPtice = async (address: AddressForDeliveryPrice) => {
  const coordinates = await getCoordinates(`${address.cityName} ${address.street} ${address.house}`)
  return await axios.get<{delivery_price: number}>(url + '/delivery_price/?city_name=' + address.cityName + '&lat=' + coordinates?.[0] + '&lon=' + coordinates?.[1])
}
