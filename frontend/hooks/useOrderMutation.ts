import {useMutation} from "@tanstack/react-query";
import {addOrder} from "../requests/load_data";
import {OrderCreate} from "../types/models";

export const useAddOrderMutation = () => {
  return useMutation({
    mutationFn: (variables: { order: OrderCreate, token: string }) => addOrder(variables.order, variables.token),
    onSuccess: (data) => {
      return data;
    },
  });
};