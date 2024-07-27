"use client";

import { useApp } from "@/lib/providers";
import { logout } from "@ui-utils/actions";
import { appConfig } from "@ui-utils/config";
import { getErrorMessage } from "@ui-utils/helpers";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/components/ui/tooltip";
import { useAuth } from "@ui/providers/auth-provider";
import { useTheme } from "@ui/providers/theme-provider";
import { cn } from "@ui/utils";
import { CircleUser, LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppNotifications } from "./app-notifications";

interface AppHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppHeader({ className, ...props }: AppHeaderProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { sidebarOpen } = useApp();
  return (
    <header className={cn("h-12 hidden items-center justify-between", className)} {...props}>
      <div className={cn("flex flex-col justify-center ml-2 md:ml-0", sidebarOpen && "md:fixed md:left-14")}>
        <h1 className="font-semibold">{appConfig.title}</h1>
        <p className="text-[10px] text-muted-foreground">By {appConfig.company}</p>
      </div>
      {sidebarOpen && <div className="hidden md:block" />}
      <div className="flex items-center gap-2">
        <AppNotifications />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-foreground/10 text-foreground">
              <CircleUser className="w-[18px] h-[18px] stroke-[1.5]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-72">
            <menu className="p-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="p-2 space-y-1">
                  <h2 className="text-sm font-semibold">{user.name}</h2>
                  <p className="text-xs">{user.email}</p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTheme(theme === "light" ? "dark" : "light");
                      }}
                    >
                      {theme === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Theme</TooltipContent>
                </Tooltip>
              </div>
              <DropdownMenuSeparator />
              <button
                className="p-2 text-destructive flex items-center justify-start gap-2 w-full h-full hover:no-underline hover:bg-muted rounded-md text-sm"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  toast.promise(logout(), {
                    loading: "Logging out...",
                    success: () => {
                      window.location.href = `${window.location.origin}/auth${user.role === "ADMIN" ? "/admin/login" : "/login"}?redirectTo=${window.location.href}`;
                      setIsLoading(false);
                      return "Logged out successfully";
                    },
                    error: (err) => {
                      window.location.href = `${window.location.origin}/auth${user.role === "ADMIN" ? "/admin/login" : "/login"}?redirectTo=${window.location.href}`;
                      setIsLoading(false);
                      return getErrorMessage(err);
                    },
                  });
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </menu>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
