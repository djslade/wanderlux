import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { LoginFormInput } from "../types/formInput/loginFormInput";
import { loginSchema } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendLoginRequest } from "../utils/sendLoginRequest";
import { setTokens } from "../utils/setTokens";
import { useNavigate } from "react-router";
import { FailedRequestException } from "../exceptions/failedRequestException";
import { useStore } from "../config/store";

export const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useStore();

  const { register, handleSubmit, setError } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      const res = await sendLoginRequest({
        email: data.email,
        password: data.password,
      });
      setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
      setUser(res.user);
      navigate("/feed");
    } catch (err) {
      if (!(err instanceof FailedRequestException)) throw err;
      setError("root.general", {
        message: err.message,
      });
    }
  };

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
