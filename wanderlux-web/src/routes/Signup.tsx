import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { SignupFormInput } from "../types/formInput/signupFormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/signupSchema";
import { sendSignupRequest } from "../utils/sendSignupRequest";
import { sendLoginRequest } from "../utils/sendLoginRequest";
import { setTokens } from "../utils/setTokens";
import { useNavigate } from "react-router";
import { FailedRequestException } from "../utils/failedRequestException";
import { useStore } from "../store/store";

export const Signup = () => {
  const navigate = useNavigate();

  const { setUser } = useStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupFormInput> = async (data) => {
    try {
      await sendSignupRequest(data);
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
        <span>{errors.root?.general?.message}</span>
      </div>
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
