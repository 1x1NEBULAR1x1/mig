import {useQuery} from "@tanstack/react-query";
import {loadTax} from "../requests/load_data";

export const useTax = () => useQuery({
  queryKey: ['tax'],
  queryFn: loadTax,
  select: (data) => data.data.tax
})