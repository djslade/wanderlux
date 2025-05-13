import type { ILoginFormInput } from "./loginFormInput";

export interface ISignupFormInput extends ILoginFormInput {
  confirmPassword: string;
}
