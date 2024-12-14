import {useQuery} from "@tanstack/react-query";
import {loadCatalog} from "../requests/load_data";

export const useCatalog = (cityId: number) => {

  const {data, isSuccess, isLoading, refetch, isFetching} = useQuery({
    queryKey: ['catalog', cityId],
    queryFn: () => loadCatalog(cityId),
    select: data => data.data
  })

  return {categories: data, isSuccess, isLoading, refetch, isFetching}
}