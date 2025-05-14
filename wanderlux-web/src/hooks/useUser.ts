import { useQuery } from "@tanstack/react-query";
import { getTokensOrThrow } from "../utils/getTokensOrThrow";
import { getApiUrl } from "../utils/getApiUrl";
import { getRequestHeaders } from "../utils/getRequestHeaders";
import { FailedRequestException } from "../exceptions/failedRequestException";
import { NoTokensException } from "../exceptions/noTokensException";
import { ExpiredRefreshException } from "../exceptions/expiredRefreshException";
import type { RefreshResponse } from "../types/responses/refreshResponse";
import { setTokens } from "../utils/setTokens";
import { ExpiredAccessException } from "../exceptions/expiredAccessException";
import { useEffect } from "react";
import type { IdentifyResponse } from "../types/responses/identifyResponse";
import { useStore } from "../config/store";
import { clearTokens } from "../utils/clearTokens";

export const useUser = () => {
  const { setUser, clearUser, user, fetched, setFetched } = useStore();

  const { error, data, isPending } = useQuery({
    queryKey: ["userSelf"],
    queryFn: async () => {
      try {
        const tokens = getTokensOrThrow();
        const res = await fetch(`${getApiUrl()}/auth`, {
          headers: getRequestHeaders(tokens.accessToken),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new FailedRequestException(data);
        }
        const data: IdentifyResponse = await res.json();
        return data.user;
      } catch (err) {
        if (err instanceof FailedRequestException === false) {
          throw err;
        }
        if (err.code === 401 && err.message === "Access token has expired") {
          const tokens = getTokensOrThrow();
          const res = await fetch(`${getApiUrl()}/auth/refresh`, {
            headers: getRequestHeaders(tokens.refreshToken),
          });
          if (res.status === 401) {
            throw new ExpiredRefreshException();
          }
          const data: RefreshResponse = await res.json();
          setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          throw new ExpiredAccessException();
        }
        throw err;
      }
    },
    retry(failureCount, error) {
      return error instanceof ExpiredAccessException && failureCount <= 0;
    },
  });

  useEffect(() => {
    if (data && !isPending) {
      console.log(data.finishedOnboarding);
      setUser(data);
      setFetched();
    }
  }, [data, isPending]);

  useEffect(() => {
    if (
      (error instanceof ExpiredRefreshException ||
        error instanceof NoTokensException) &&
      !isPending
    ) {
      clearTokens();
      clearUser();
      setFetched();
    }
  }, [error, isPending]);

  return { user, fetched };
};
