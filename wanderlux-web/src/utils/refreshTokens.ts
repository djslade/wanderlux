import type { RefreshResponse } from "../types/responses/refreshResponse";
import { clearTokens } from "./clearTokens";
import { getApiUrl } from "./getApiUrl";
import { setTokens } from "./setTokens";

export const refreshTokens = async (refreshToken: string) => {
  const res = await fetch(`${getApiUrl()}/auth/refresh`, {
    headers: new Headers({
      Authorization: `Bearer ${refreshToken}`,
    }),
  });
  if (res.status === 401) {
    clearTokens();
    return;
  }
  const data: RefreshResponse = await res.json();
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
};
