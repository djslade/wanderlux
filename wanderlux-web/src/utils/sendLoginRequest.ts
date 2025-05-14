import { getApiUrl } from "./getApiUrl";
import type { ErrorResponse } from "../types/errorResponse";
import type { LoginFormInput } from "../types/loginFormInput";
import type { LoginResponse } from "../types/loginResponse";
import { FailedRequestException } from "./failedRequestException";

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
