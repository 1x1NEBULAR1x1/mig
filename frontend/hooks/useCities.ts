import {useQuery} from "@tanstack/react-query";
import {loadCities} from "../requests/load_data";

export const useCities = () => {

  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['cities'],
    queryFn: loadCities,
    select: data => data.data
  })

  return {cities:data, isLoading, isSuccess}
}