import { type JSX } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../hooks/useUser";

type UnauthWrapperProps = {
  child: JSX.Element;
};

export const UnauthWrapper = ({ child }: UnauthWrapperProps) => {
  const { user, fetched } = useUser();
  const navigate = useNavigate();

  if (!fetched) return "Loading...";

  if (user) navigate("/");

  return child;
};
