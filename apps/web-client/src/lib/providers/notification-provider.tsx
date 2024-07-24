import type { Notification } from "@ui-utils/types";

import { appConfig } from "@ui-utils/config";
import { useAuth } from "@ui/providers/auth-provider";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface NotificationsContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (!user?.email) return;
    const socket = io(appConfig.notifier);
    socket.on("connect", () => {
      socket.emit("receive-notifications", user.email);
      socket.on("notifications", (notifications: Notification[]) => setNotifications(notifications));
      socket.on("notification", (notification: Notification) => setNotifications((prev) => [...prev, notification]));
    });
  }, [user]);
  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>{children}</NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
