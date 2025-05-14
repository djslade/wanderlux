import type { Tokens } from "../types/tokens";

export const getTokens = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return {
    accessToken,
    refreshToken,
  } as Tokens;
};
