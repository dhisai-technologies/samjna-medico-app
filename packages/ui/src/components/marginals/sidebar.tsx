"use client";
import { cn } from "@ui/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { Button } from "../ui/button";

interface Links {
  title: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>{children}</SidebarContext.Provider>;
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (
  props: React.ComponentProps<typeof motion.div> & {
    mobileHeader?: React.ReactNode;
  },
) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  mobileHeader,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  mobileHeader?: React.ReactNode;
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full py-2 px-3 items-center hidden  md:flex md:flex-col bg-muted w-[300px] flex-shrink-0",
          className,
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  mobileHeader,
  ...props
}: React.ComponentProps<"div"> & {
  mobileHeader?: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div className={cn("h-12 px-4 py-4 flex flex-row md:hidden items-center bg-muted w-full")} {...props}>
        <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="flex justify-center z-20">
          <Menu className="w-4 h-4" />
        </Button>
        {mobileHeader}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-background p-10 z-[100] flex flex-col justify-between",
                className,
              )}
            >
              <Button
                size="icon"
                variant="outline"
                className="absolute right-10 top-10 z-50"
                onClick={() => setOpen(!open)}
              >
                <X />
              </Button>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  titleClassName,
  ...props
}: {
  link: Links;
  className?: string;
  titleClassName?: string;
  props?: LinkProps;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn("flex w-full items-center justify-start gap-2  group/sidebar p-2 rounded-md", className)}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0",
          titleClassName,
        )}
      >
        {link.title}
      </motion.span>
    </Link>
  );
};

interface SidebarButtonProps extends React.ComponentProps<typeof Button> {
  title: string;
  icon: React.JSX.Element | React.ReactNode;
}

export const SidebarButton = ({ title, icon, className, ...props }: SidebarButtonProps) => {
  const { open, animate } = useSidebar();
  return (
    <button
      type="button"
      className={cn("flex w-full items-center justify-start gap-2  group/sidebar p-2 rounded-md", className)}
      {...props}
    >
      {icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {title}
      </motion.span>
    </button>
  );
};
