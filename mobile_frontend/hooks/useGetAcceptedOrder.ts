import {useQuery} from "@tanstack/react-query";
import {checkPaymentStatus} from "../requests/load_data";


export const useCheckPaymentStatus = (orderId: number) =>  useQuery({
  queryKey: ['checkPaymentStatus', orderId],
  queryFn: () => checkPaymentStatus(orderId),
  enabled: !!orderId,
  retry: false
})