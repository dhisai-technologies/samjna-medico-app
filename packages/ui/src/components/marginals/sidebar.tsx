"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type LucideIcon, PanelRight } from "lucide-react";
import * as React from "react";

import { Button } from "@ui/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/components/ui/tooltip";
import { useSidebar } from "@ui/providers/sidebar-provider";
import { cn } from "@ui/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  links: {
    title: string;
    href: string;
    icon: LucideIcon;
    active: string;
  }[];
}

export function Sidebar({ className, children, links, ...props }: SidebarProps) {
  const { setIsSidebarOpen } = useSidebar();
  const pathname = usePathname();
  return (
    <div className={cn("border-r bg-muted/50 h-full w-full flex flex-col", className)} {...props}>
      <div className="px-2 lg:px-4 h-12 flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <PanelRight className="w-4 h-4 text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Hide Sidebar</TooltipContent>
        </Tooltip>
        {children}
      </div>
      <nav className="grid items-start px-2 text-sm font-medium lg:px-3">
        {links.map(({ title, href, icon, active }) => (
          <Link
            href={href}
            key={title}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              active === "default" && pathname === href && "bg-black/10 text-foreground",
              active === "include" && pathname.includes(href) && "bg-black/10 text-foreground",
            )}
          >
            {React.createElement(icon, {
              className: "w-4 h-4 text-primary",
            })}
            {title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
