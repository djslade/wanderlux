import type { Tokens } from "../types/tokens";

export const setTokens = (tokens: Tokens) => {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
};
