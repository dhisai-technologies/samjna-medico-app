"use client";

import type { User } from "@ui-utils/types";
import { TooltipProvider } from "@ui/components/ui/tooltip";
import type React from "react";
import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";

export function GlobalProvider({
  user,
  children,
}: {
  user?: User;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <AuthProvider user={user}>{children}</AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
