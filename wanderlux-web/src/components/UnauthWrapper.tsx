import { useEffect, type JSX } from "react";
import { getTokens } from "../utils/getTokens";
import { useNavigate } from "react-router";

type UnauthWrapperProps = {
  child: JSX.Element;
};

export const UnauthWrapper = ({ child }: UnauthWrapperProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getTokens() !== null) {
      navigate("/", { replace: true });
    }
  }, []);

  return child;
};
