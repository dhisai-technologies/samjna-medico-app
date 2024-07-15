"use client";

import type { User } from "@ui-utils/types";

import { Toaster } from "@ui/components/ui/sonner";
import { TooltipProvider } from "@ui/components/ui/tooltip";
import type React from "react";
import { AuthProvider } from "./auth-provider";
import { NotificationProvider } from "./notification-provider";
import { SidebarProvider } from "./sidebar-provider";
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
        <AuthProvider user={user}>
          <NotificationProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
}
