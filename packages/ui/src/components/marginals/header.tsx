import { appConfig, appMenu, userMenu } from "@utils/config";
import { convertEnumToReadableFormat, getFallbackProfile } from "@utils/helpers";
import type { User } from "@utils/types";
import { type VariantProps, cva } from "class-variance-authority";
import Image, { type StaticImageData } from "next/image";

import { LogOut } from "lucide-react";
import * as React from "react";

import { Icons } from "@ui/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Badge } from "@ui/components/ui/badge";
import { DropdownMenuSeparator } from "@ui/components/ui/dropdown-menu";
import { cn } from "@ui/utils";

export const headerVariants = cva("h-12 relative flex justify-between items-center py-2 px-5", {
  variants: {
    variant: {
      default: "bg-muted border-b-[1px] border-border",
      transparent: "bg-white/40 backdrop-blur-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof headerVariants> {}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(({ className, variant, ...props }, ref) => (
  <header className={cn(headerVariants({ variant, className }))} ref={ref} {...props} />
));

Header.displayName = "Header";

export interface HeaderLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  logo: "dark" | "light";
  href?: string;
}

const HeaderLogo = React.forwardRef<HTMLAnchorElement, HeaderLogoProps>(({ className, href, logo, ...props }, ref) => (
  <div className="flex gap-[2px] items-center text-xl">
    <Icons.logo className={cn("h-4", logo === "light" && "invert")} />
    <a href="/" className={cn("font-medium", logo === "light" ? "text-white" : "text-dark")}>
      {appConfig.companyName}
    </a>
    <a ref={ref} href={href} className={cn("ml-1 font-bold text-primary", className)} {...props} />
  </div>
));

HeaderLogo.displayName = "HeaderLogo";

export interface HeaderAppsMenuContentProps extends React.HTMLAttributes<HTMLMenuElement> {
  user: User;
  apps: {
    title: string;
    src: StaticImageData;
    href: string;
  }[];
}

const HeaderAppsMenuContent = React.forwardRef<HTMLMenuElement, HeaderAppsMenuContentProps>(
  ({ className, user, apps, ...props }, ref) => (
    <menu ref={ref} className={cn("p-1 flex flex-col", className)} {...props}>
      {user.organization && (
        <>
          <div className="p-2 flex items-center gap-2">
            <Avatar className="w-10 h-10 text-xs">
              <AvatarImage src={user.organization.logo} />
              <AvatarFallback className="bg-zinc-500 text-white">{getFallbackProfile(user, true)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 w-full">
              <h2 className="text-sm font-semibold">Organization</h2>
              <div className="flex justify-between items-center">
                <p className="text-xs">{user.organization.name}</p>
                <Badge variant="secondary" className="text-[10px]">
                  {convertEnumToReadableFormat(user.role)}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
        </>
      )}
      <h2 className="text-sm font-semibold p-2">Apps</h2>
      <div className="px-3 py-1 grid grid-cols-3 gap-5">
        {apps.map(({ src, title, href }) => (
          <a
            className="flex flex-col items-center gap-1 hover:scale-110 transition-transform duration-300 ease-in-out"
            href={href}
            key={title}
          >
            <Image src={src} alt={title} height={56} className="h-14" />
            <span className="text-xs text-muted-foreground">{title}</span>
          </a>
        ))}
      </div>
      <DropdownMenuSeparator />
      <h2 className="text-sm font-semibold p-2">More</h2>
      <ul className="w-full px-3 pb-3">
        {appMenu.map(({ title, href, icon }) => (
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
    </menu>
  ),
);

HeaderAppsMenuContent.displayName = "HeaderAppsMenuContent";

export interface HeaderUserMenuContentProps extends React.HTMLAttributes<HTMLMenuElement> {
  user: User;
  logout: React.FormHTMLAttributes<HTMLFormElement>["action"];
}

const HeaderUserMenuContent = React.forwardRef<HTMLMenuElement, HeaderUserMenuContentProps>(
  ({ className, user, logout, ...props }, ref) => (
    <menu ref={ref} className={cn("p-1 flex flex-col", className)} {...props}>
      <div className="p-2 space-y-1">
        <h2 className="text-sm font-semibold">{user.name}</h2>
        <p className="text-xs">{user.email}</p>
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
      <form action={logout}>
        <button
          className="p-2 text-destructive flex items-center justify-start gap-2 w-full h-full hover:no-underline hover:bg-muted rounded-md text-sm"
          type="submit"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </form>
    </menu>
  ),
);

HeaderUserMenuContent.displayName = "HeaderUserMenuContent";

export { Header, HeaderLogo, HeaderAppsMenuContent, HeaderUserMenuContent };
