import { getApiUrl } from "./getApiUrl";
import type { ErrorResponse } from "../types/responses/errorResponse";
import { FailedRequestException } from "../exceptions/failedRequestException";
import type { BaseResponse } from "../types/responses/baseResponse";

export const sendLogoutRequest = async (refreshToken: string) => {
  const res = await fetch(`${getApiUrl()}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    const data: ErrorResponse = await res.json();
    throw new FailedRequestException(data);
  }
  const data: BaseResponse = await res.json();
  return data;
};
