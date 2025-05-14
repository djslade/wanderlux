import type { Tokens } from "../types/tokens";

export const getTokens = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!accessToken || !refreshToken) return null;
  return {
    accessToken,
    refreshToken,
  } as Tokens;
};
