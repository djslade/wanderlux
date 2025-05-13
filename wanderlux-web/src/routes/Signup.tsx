import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { ISignupFormInput } from "../types/signupFormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/signupSchema";
import { getApiUrl } from "../config/getApiUrl";

export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupFormInput>({
    resolver: zodResolver(signupSchema),
  });
  const onSubmit: SubmitHandler<ISignupFormInput> = async (data) => {
    try {
      const res = await fetch(`${getApiUrl()}/auth/signup`, {
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.status !== 201) {
        throw new Error(json.message);
      }
      const loginRes = await fetch(`${getApiUrl()}/auth/login`, {
        body: JSON.stringify(data),
      });
      const loginJson = await loginRes.json();
      if (loginRes.status !== 200) {
        throw new Error(loginJson.message);
      }
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="">
        <label htmlFor="email">Email</label>
        <input type="text" {...register("email")} />
        <span>{errors.email?.message}</span>
      </div>
      <div className="">
        <label htmlFor="password">Password</label>
        <input type="password" {...register("password")} />
        <span>{errors.password?.message}</span>
      </div>
      <div className="">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" {...register("confirmPassword")} />
        <span>{errors.confirmPassword?.message}</span>
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
};
