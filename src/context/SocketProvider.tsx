import { SocketContext } from "@/hooks/socket/useSocket";
import { useEffect, useRef, ReactNode, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";

export type SocketContextType = { socket: Socket | null; isConnected: boolean };

interface SocketProviderProps {
  children: ReactNode;
}

const SERVER_URL = import.meta.env.VITE_API_URL;

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    // Initialize socket connection once
    socketRef.current = io(SERVER_URL, {
      autoConnect: false,
      withCredentials: true,
    });

    socketRef.current.on("connect", onConnect);
    socketRef.current.on("disconnect", onDisconnect);

    socketRef.current.connect();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const value = useMemo<SocketContextType>(
    () => ({
      isConnected,
      socket: socketRef.current,
    }),
    [isConnected]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
