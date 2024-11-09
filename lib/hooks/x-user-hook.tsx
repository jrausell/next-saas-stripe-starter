import { useQuery } from "@tanstack/react-query";

import { getXUsers, XUserBasic, XUserQueryParams } from "../query/x-user";

export function useXUsers(params: XUserQueryParams = {}) {
  return useQuery<XUserBasic[]>({
    queryKey: ["xusers", params],
    queryFn: () => getXUsers(params),
  });
}
