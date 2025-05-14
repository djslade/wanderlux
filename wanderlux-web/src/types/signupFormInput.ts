import type { LoginFormInput } from "./loginFormInput";

export type SignupFormInput = LoginFormInput & {
  confirmPassword: string;
};
