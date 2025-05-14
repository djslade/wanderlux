import { type JSX } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../hooks/useUser";

type AuthWrapperProps = {
  child: JSX.Element;
};

export const AuthWrapper = ({ child }: AuthWrapperProps) => {
  const { user, fetched } = useUser();
  const navigate = useNavigate();

  if (!fetched) return "Loading...";

  if (!user) navigate("/login");

  return child;
};
