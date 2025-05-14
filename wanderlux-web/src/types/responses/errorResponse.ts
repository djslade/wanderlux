import type { BaseResponse } from "./baseResponse";

export type ErrorResponse = BaseResponse & {
  error: string;
  statusCode: number;
};
