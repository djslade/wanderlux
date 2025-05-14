import type { BaseResponse } from "./baseResponse";

export type ErrorResponse = BaseResponse & {
  code: number;
};
