import { TAIContextValue } from "@/context/AIProvider";
import { createContext, useContext } from "react";

export const AIContext = createContext<TAIContextValue>(null);

export const useAI = () => {
  try {
    const value = useContext<TAIContextValue>(AIContext);
    return value;
  } catch (error) {
    throw new Error("Please use AI Context in its Provider");
  }
};
