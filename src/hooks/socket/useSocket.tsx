import { SocketContextType } from "@/context/SocketProvider";
import { createContext, useContext } from "react";

export const SocketContext = createContext<SocketContextType>(null);
export const useSocket = () => {
  try {
    const value = useContext<SocketContextType>(SocketContext);
    return value;
  } catch (error) {
    console.error(error);
  }
};
