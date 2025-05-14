import { getApiUrl } from "./getApiUrl";
import type { ErrorResponse } from "../types/errorResponse";
import type { SignupFormInput } from "../types/signupFormInput";
import type { SignupResponse } from "../types/signupResponse";
import { FailedRequestException } from "./failedRequestException";

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
