import { getApiUrl } from "./getApiUrl";
import type { ErrorResponse } from "../types/responses/errorResponse";
import type { SignupFormInput } from "../types/formInput/signupFormInput";
import type { SignupResponse } from "../types/responses/signupResponse";
import { FailedRequestException } from "../exceptions/failedRequestException";

export const sendSignupRequest = async (body: SignupFormInput) => {
  const res = await fetch(`${getApiUrl()}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  if (res.status !== 201) {
    const data: ErrorResponse = await res.json();
    throw new FailedRequestException(data);
  }
  const data: SignupResponse = await res.json();
  return data;
};
