"use client";

import { appConfig } from "@ui-utils/config";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

interface SocketContextType {
  socket?: Socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    const socket = io(appConfig.fastapi, {
      path: "/socket.io",
    });
    socket.on("connect", () => {
      setSocket(socket);
    });
  }, []);
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
