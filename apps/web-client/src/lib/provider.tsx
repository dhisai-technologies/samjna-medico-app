"use client";

import type { User } from "@ui-utils/types";

import type React from "react";
import { createContext, useContext } from "react";

import { GlobalProvider } from "@ui/providers/global-provider";

type AppContextType = {
  sample?: string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({
  user,
  children,
}: {
  user?: User;
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider user={user}>
      <AppContext.Provider value={{}}>{children}</AppContext.Provider>
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
