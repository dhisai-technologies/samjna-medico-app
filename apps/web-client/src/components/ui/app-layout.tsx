"use client";
import { sidebar } from "@/lib/config";
import { useApp } from "@/lib/providers";
import { logout } from "@ui-utils/actions";
import { appConfig } from "@ui-utils/config";
import { getErrorMessage, getRoleBasedNav } from "@ui-utils/helpers";
import { Icons } from "@ui/components/icons";
import { Sidebar, SidebarBody, SidebarButton, SidebarLink } from "@ui/components/marginals/sidebar";
import { useAuth } from "@ui/providers/auth-provider";
import { cn } from "@ui/utils";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "./app-header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useApp();
  return (
    <div className={cn("rounded-md flex flex-col md:flex-row bg-background w-screen overflow-hidden", "h-screen")}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-10" mobileHeader={<AppHeader className="flex w-full flex-1" />}>
          <div className="flex flex-col flex-1 overflow-y-auto w-full">
            <SidebarLink
              link={{
                title: appConfig.title,
                href: "/#",
                icon: <Icons.logo className="h-5 w-5 flex-shrink-0" />,
              }}
              titleClassName="md:text-muted font-semibold"
            />
            <div className="mt-8 flex flex-col gap-2">
              {getRoleBasedNav(sidebar, user.role, {
                DOCTOR: ["User Management"],
                EMPLOYEE: ["User Management", "Logs"],
                INTERN: ["User Management", "Logs"],
              }).map((link, idx) => (
                <SidebarLink
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={idx}
                  link={link}
                  className={cn(
                    !sidebarOpen && "w-9 h-9",
                    pathname === link.href && "bg-foreground/10 text-foreground",
                  )}
                />
              ))}
              <SidebarButton
                title="Logout"
                icon={<LogOut className="w-5 h-5 flex-shrink-0 text-muted-foreground" />}
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  toast.promise(logout(), {
                    loading: "Logging out...",
                    success: () => {
                      window.location.href = `${appConfig.url}/auth${user.role === "ADMIN" ? "/admin/login" : "/login"}?redirectTo=${window.location.href}`;
                      setIsLoading(false);
                      return "Logged out successfully";
                    },
                    error: (err) => {
                      window.location.href = `${appConfig.url}/auth${user.role === "ADMIN" ? "/admin/login" : "/login"}?redirectTo=${window.location.href}`;
                      setIsLoading(false);
                      return getErrorMessage(err);
                    },
                  });
                }}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
