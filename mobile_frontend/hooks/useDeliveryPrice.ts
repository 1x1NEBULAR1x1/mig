import {useQuery} from "@tanstack/react-query";
import {getDeliveryPtice} from "../requests/load_data";

export type AddressForDeliveryPrice = {
  cityName: string
  street: string
  house: string
}

export const useDeliveryPrice = (address: AddressForDeliveryPrice) => {
  const q = useQuery({
    queryKey: ['deliveryPrice', address.cityName, address.street, address.house],
    queryFn: () => getDeliveryPtice(address),
    select: data => data.delivery_price
  })

  return {...q, deliveryPrice: q.data}
}