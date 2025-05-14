import type { ErrorResponse } from "../types/errorResponse";
import { getApiUrl } from "./getApiUrl";

export const refreshTokens = async (refreshToken: string) => {
  const res = await fetch(`${getApiUrl()}/auth/refresh`, {
    headers: new Headers({
      Authorization: `Bearer ${refreshToken}`,
    }),
  });
  if (res.status !== 200) {
    const data: ErrorResponse = await res.json();
    throw new Error(data.message);
  }
  return res.json();
};
