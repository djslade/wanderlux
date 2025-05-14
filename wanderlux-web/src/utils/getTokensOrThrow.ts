import { NoTokensException } from "../exceptions/noTokensException";
import type { Tokens } from "../types/tokens";

export const getTokensOrThrow = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!accessToken || !refreshToken) throw new NoTokensException();
  return {
    accessToken,
    refreshToken,
  } as Tokens;
};
