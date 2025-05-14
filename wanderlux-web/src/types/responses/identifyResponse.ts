import type { User } from "../user";
import type { BaseResponse } from "./baseResponse";

export type IdentifyResponse = BaseResponse & {
  user: User;
};
