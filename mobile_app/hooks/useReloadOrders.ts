import {useQuery} from "@tanstack/react-query";
import {loadOrders} from "../requests/load_data";


export const useReloadOrders = (userId: number | undefined) => useQuery({
  queryKey: ['reloadOrders'],
  queryFn: async () => {
    if (userId) {
      return await loadOrders(userId)
    } else {
      throw new Error("User id is missing");
    }
  },
  enabled: !!userId,
  refetchInterval: 15000,
  select: (data) => data.data,
})