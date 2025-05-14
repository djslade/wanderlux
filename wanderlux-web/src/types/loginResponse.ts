import type { BaseResponse } from "./baseResponse";

export type LoginResponse = BaseResponse & {
  userId: number;
  refreshToken: string;
  accessToken: string;
};
