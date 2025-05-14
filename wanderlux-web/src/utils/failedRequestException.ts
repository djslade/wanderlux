import type { ErrorResponse } from "../types/errorResponse";

export class FailedRequestException extends Error {
  public code: number;

  constructor(res: ErrorResponse) {
    super(res.message);
    this.code = res.code;
  }
}
