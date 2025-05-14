import type { User } from "../user";
import type { BaseResponse } from "./baseResponse";

export type LoginResponse = BaseResponse & {
  user: User;
  refreshToken: string;
  accessToken: string;
};
