import type { User } from "@ui-utils/types";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const defaultUser: User = {
  id: 0,
  email: "",
  active: true,
  name: "",
  role: "EMPLOYEE",
};

export function AuthProvider({
  user,
  children,
}: {
  user?: User;
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User>(user || defaultUser);

  useEffect(() => {
    if (user?.email) {
      setCurrentUser(user);
    }
  }, [user]);
  return <AuthContext.Provider value={{ user: currentUser, setUser: setCurrentUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
