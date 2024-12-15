import {useQuery} from "@tanstack/react-query";
import {loadUser} from "../requests/load_data";

export const useUser = (token: string | null) => {
  const q = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is missing");
      }
      return await loadUser(token);
    },
    enabled: !!token,
    retry: false,
  })

  return {...q, user: q.data}
}