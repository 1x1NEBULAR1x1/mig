import { useQuery } from '@tanstack/react-query';
import {checkPaymentStatus} from "../requests/load_data";

export const usePaymentStatus = (orderId: number) => useQuery({
  queryKey: ['checkPaymentStatus', orderId],
  queryFn: () => checkPaymentStatus(orderId),
  refetchInterval: 15000,
  select: (data) => data.data
});
