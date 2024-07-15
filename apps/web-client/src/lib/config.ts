import { LayoutDashboard, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/",
    active: "default",
  },
  {
    title: "User Management",
    href: "/user-management",
    active: "default",
  },
  {
    title: "Logs",
    href: "/logs",
    active: "default",
  },
  {
    title: "Settings",
    href: "/settings",
    active: "default",
  },
];

export const userMenu: {
  title: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Dashboard",
    href: "/hub",
    icon: LayoutDashboard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
