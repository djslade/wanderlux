import { useEffect, type JSX } from "react";
import { getTokens } from "../utils/getTokens";
import { useNavigate } from "react-router";

type AuthWrapperProps = {
  child: JSX.Element;
};

export const AuthWrapper = ({ child }: AuthWrapperProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getTokens() === null) {
      navigate("/login", { replace: true });
    }
  }, []);

  return child;
};
