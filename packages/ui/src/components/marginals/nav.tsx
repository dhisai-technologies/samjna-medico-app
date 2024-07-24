"use client";

import { cn } from "@ui/utils";
import Link from "next/link";
import * as React from "react";

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  navListClass?: string;
}

const Nav = React.forwardRef<HTMLDivElement, NavProps>(({ className, navListClass, children, ...props }, ref) => (
  <div className={cn("border-b border-border bg-muted w-full flex flex-col", className)} {...props} ref={ref}>
    <nav className={cn("flex items-end justify-start gap-6 text-sm font-medium px-5 h-12", navListClass)}>
      {children}
    </nav>
  </div>
));

Nav.displayName = "Nav";

interface NavLinkItemProps extends React.ComponentProps<typeof Link> {
  isActive: boolean;
}

const NavLinkItem = React.forwardRef<HTMLAnchorElement, NavLinkItemProps>(
  ({ className, children, isActive, ...props }, ref) => (
    <Link
      ref={ref}
      className={cn(
        "flex items-center gap-3 py-3 text-muted-foreground border-b-2 border-b-transparent transition-all hover:text-foreground",
        isActive && "border-b-primary text-foreground",
      )}
      {...props}
    >
      {children}
    </Link>
  ),
);

NavLinkItem.displayName = "NavLinkItem";

interface NavAnchorItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  isActive: boolean;
  href?: string;
}

const NavAnchorItem = React.forwardRef<HTMLAnchorElement, NavAnchorItemProps>(
  ({ className, children, isActive, href, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "flex items-center gap-3 py-3 text-muted-foreground border-b-2 border-b-transparent transition-all hover:text-foreground",
        isActive && "border-b-primary text-foreground",
      )}
      href={href}
      {...props}
    >
      {children}
    </a>
  ),
);

NavAnchorItem.displayName = "NavAnchorItem";

export { Nav, NavLinkItem, NavAnchorItem };
