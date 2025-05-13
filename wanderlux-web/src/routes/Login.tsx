import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { ILoginFormInput } from "../types/loginFormInput";
import { loginSchema } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export const Login = () => {
  const { register, handleSubmit } = useForm<ILoginFormInput>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit: SubmitHandler<ILoginFormInput> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="">
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")} />
      </div>
      <div className="">
        <label htmlFor="password">Password</label>
        <input type="password" {...register("password")} />
      </div>
      <button type="submit">Log in</button>
    </form>
  );
};
