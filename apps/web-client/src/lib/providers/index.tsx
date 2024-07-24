"use client";

import type { User } from "@ui-utils/types";

import type React from "react";
import { createContext, useContext, useState } from "react";

import { GlobalProvider } from "@ui/providers/global-provider";
import { Toaster } from "sonner";
import { SocketProvider } from "./socket-provider";

type AppContextType = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({
  user,
  children,
}: {
  user?: User;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <GlobalProvider user={user}>
      <SocketProvider>
        <AppContext.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</AppContext.Provider>
      </SocketProvider>
      <Toaster
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
      />
    </GlobalProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
}
