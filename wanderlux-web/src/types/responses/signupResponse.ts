import type { User } from "../user";
import type { BaseResponse } from "./baseResponse";

export type SignupResponse = BaseResponse & {
  user: User;
};
