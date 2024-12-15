import { useQuery } from "@tanstack/react-query";
import { checkVerificationCodeMobile } from "../requests/load_data";

export const useVerification = (phoneNumber: string, code?: string) => {
  const q = useQuery({
    queryKey: ['verification', phoneNumber, code],
    queryFn: () => checkVerificationCodeMobile(phoneNumber, code!),
    enabled: code !== undefined,
    retry: false,
  });

  return { result: q.data, ...q };
};
