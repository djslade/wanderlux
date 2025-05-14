import { getApiUrl } from "./getApiUrl";
import type { ErrorResponse } from "../types/responses/errorResponse";
import type { LoginFormInput } from "../types/formInput/loginFormInput";
import type { LoginResponse } from "../types/responses/loginResponse";
import { FailedRequestException } from "../exceptions/failedRequestException";

export const sendLoginRequest = async (body: LoginFormInput) => {
  const res = await fetch(`${getApiUrl()}/auth/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  if (res.status !== 200) {
    const data: ErrorResponse = await res.json();
    throw new FailedRequestException(data);
  }
  const data: LoginResponse = await res.json();
  return data;
};
