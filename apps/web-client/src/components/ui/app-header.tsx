"use client";

import { navigation, userMenu } from "@/lib/config";
import { logout } from "@ui-utils/actions";
import { appConfig } from "@ui-utils/config";
import { getErrorMessage, getRoleBasedNav } from "@ui-utils/helpers";
import { Icons } from "@ui/components/icons";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/components/ui/tooltip";
import { useAuth } from "@ui/providers/auth-provider";
import { useTheme } from "@ui/providers/theme-provider";
import { cn } from "@ui/utils";
import { CircleUser, LogOut, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { AppNotifications } from "./app-notifications";
import { AppSearch } from "./app-search";

export function AppHeader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { setTheme, theme } = useTheme();
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-4">
        <Icons.logo className="w-8 h-8" />
        {getRoleBasedNav(navigation, user.role, {
          DOCTOR: ["User Management"],
          EMPLOYEE: ["User Management", "Logs"],
          INTERN: ["User Management", "Logs"],
        }).map(({ title, href, active }) => (
          <Link
            href={href}
            key={title}
            className={cn(
              "transition-colors text-muted-foreground hover:text-foreground px-2 py-1 min-w-max rounded-md",
              active === "default" && pathname === href && "text-foreground bg-accent",
              active === "include" && pathname.includes(href) && "text-foreground bg-accent",
            )}
          >
            {title}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Icons.logo className="w-8 h-8" />
            {navigation.map(({ title, href, active }) => (
              <Link
                href={href}
                key={title}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  active === "default" && pathname === href && "text-foreground hover:text-foreground",
                  active === "include" && pathname.includes(href) && "text-foreground hover:text-foreground",
                )}
              >
                {title}
              </Link>
            ))}{" "}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <AppSearch />
        <AppNotifications />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
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
            <ul className="w-full">
              {userMenu.map(({ title, href, icon }) => (
                <li className="hover:bg-muted rounded-md text-sm" key={title}>
                  <a href={href} className="p-2 flex items-center justify-start gap-2 w-full h-full hover:no-underline">
                    {React.createElement(icon, {
                      className: "w-4 h-4 text-primary",
                    })}
                    <span>{title}</span>
                  </a>
                </li>
              ))}
            </ul>
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
                    window.location.href = `${appConfig.url}/auth/login?redirectTo=${window.location.href}`;
                    setIsLoading(false);
                    return "Logged out successfully";
                  },
                  error: (err) => {
                    window.location.href = `${appConfig.url}/auth/login?redirectTo=${window.location.href}`;
                    setIsLoading(false);
                    return getErrorMessage(err);
                  },
                });
              }}
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
