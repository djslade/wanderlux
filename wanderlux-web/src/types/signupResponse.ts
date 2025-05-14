import type { BaseResponse } from "./baseResponse";

export type SignupResponse = BaseResponse & {
  userId: number;
};
