import type { BaseResponse } from "./baseResponse";

export type RefreshResponse = BaseResponse & {
  accessToken: string;
  refreshToken: string;
};
