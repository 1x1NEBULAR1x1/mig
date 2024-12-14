import {useQuery} from "@tanstack/react-query";
import {loadOrderPriorities} from "../requests/load_data";

export const useOrderPriorities = () => {
  return useQuery({queryKey: ['orderPriorities'], queryFn: loadOrderPriorities, select: data => data.data})
}