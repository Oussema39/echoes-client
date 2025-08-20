import { useEffect } from "react";
import { Socket } from "socket.io-client";

export function useSocketEvent<T>(
  socket: Socket | null,
  eventName: string,
  handler: (data: T) => void
) {
  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [socket, eventName, handler]);
}
