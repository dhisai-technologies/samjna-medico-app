import type { Notification } from "@ui-utils/types";

import { appConfig } from "@ui-utils/config";
import { useAuth } from "@ui/providers/auth-provider";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { Analytics, CSV } from "../types/analytics";

interface SocketContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  analytics?: Analytics;
  setAnalytics: React.Dispatch<React.SetStateAction<Analytics | undefined>>;
  csv?: CSV;
  setCSV: React.Dispatch<React.SetStateAction<CSV | undefined>>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>();
  const [csv, setCSV] = useState<CSV>();
  const { user } = useAuth();
  useEffect(() => {
    if (!user?.email) return;
    const socket = io(appConfig.notifier);
    socket.on("connect", () => {
      socket.emit("receive-notifications", user.email);
      socket.emit("receive-analytics", user.email);
      socket.on("notifications", (notifications: Notification[]) => setNotifications(notifications));
      socket.on("notification", (notification: Notification) => setNotifications((prev) => [...prev, notification]));
      socket.on("analytics", (analytics: Analytics) => {
        setAnalytics(analytics);
      });
      socket.on("csv", (csv: CSV) => {
        setCSV(csv);
      });
    });
  }, [user]);
  return (
    <SocketContext.Provider value={{ notifications, setNotifications, analytics, setAnalytics, setCSV, csv }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
