import { FileText, LayoutDashboard, Package2, Settings, Shapes, UsersRound } from "lucide-react";

export const sidebar = [
  {
    title: "Dashboard",
    href: "/",
    active: "default",
    icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0 stroke-[1.5px]" />,
  },
  {
    title: "Sessions",
    href: "/sessions",
    active: "default",
    icon: <Shapes className="h-5 w-5 flex-shrink-0 stroke-[1.5px]" />,
  },
  {
    title: "Storage",
    href: "/storage",
    active: "default",
    icon: <Package2 className="h-5 w-5 flex-shrink-0 stroke-[1.5px]" />,
  },
  {
    title: "User Management",
    href: "/user-management",
    active: "default",
    icon: <UsersRound className="h-5 w-5 flex-shrink-0 stroke-[1.5px]" />,
  },
  {
    title: "Logs",
    href: "/logs",
    active: "default",
    icon: <FileText className="h-5 w-5 flex-shrink-0 stroke-[1.5px]" />,
  },
  {
    title: "Settings",
    href: "/settings",
    active: "default",
    icon: <Settings className="h-5 w-5 flex-shrink-0 stroke-[1.5px]" />,
  },
];
