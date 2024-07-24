"use client";

import { useSocket } from "@/lib/providers/socket-provider";
import { markNotificationAsRead } from "@ui-utils/actions";
import { formatToHumanReadable, getErrorMessage } from "@ui-utils/helpers";
import type { Notification } from "@ui-utils/types";
import { Button } from "@ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/ui/popover";
import { Separator } from "@ui/components/ui/separator";
import { format } from "date-fns";
import { BellIcon, CheckCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";

export function AppNotifications() {
  const { notifications, setNotifications } = useSocket();
  const [currentNotifications, setCurrentNotifications] = useState<Notification[]>([]);
  const [open, onOpenChange] = useState(false);
  useEffect(() => {
    setCurrentNotifications(
      notifications.map((notification) => ({
        ...notification,
        commonTime: format(notification.createdAt, "ccc dd MMM hh:mm a"),
        humanReadableTime: formatToHumanReadable(notification.createdAt),
      })),
    );
  }, [notifications]);
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="stroke-[1.5]">
          {currentNotifications.length > 0 ? (
            <div>
              <span className="absolute -top-1 -right-1 text-primary-foreground bg-primary h-3 w-3 rounded-full flex items-center justify-center text-[8px]">
                {currentNotifications.length}
              </span>
              <BellIcon className="w-4 h-4" />
            </div>
          ) : (
            <BellIcon className="w-4 h-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 min-w-72">
        <div className="flex items-center justify-between px-4 h-12">
          <h2 className="font-semibold">Notifications</h2>
          {currentNotifications.length > 0 && (
            <Button
              variant="ghost"
              className="text-xs h-8 px-2 text-primary"
              onClick={() => {
                toast.promise(markNotificationAsRead("all"), {
                  loading: "Marking all as read...",
                  success: () => {
                    setNotifications([]);
                    onOpenChange(false);
                    return "Marked all as read";
                  },
                  error: (res) => {
                    onOpenChange(false);
                    return getErrorMessage(res);
                  },
                });
              }}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <div className="flex flex-col p-4 gap-1">
          {currentNotifications.map((notification) => (
            <div
              key={notification.id}
              className="group relative flex flex-col p-2 gap-1 bg-muted rounded-md border border-border"
            >
              <button
                type="button"
                className="absolute top-1 right-1 hidden group-hover:block"
                onClick={() => {
                  toast.promise(markNotificationAsRead(notification.id), {
                    loading: "Marking as read...",
                    success: () => {
                      setNotifications(notifications.filter((n) => n.id !== notification.id));
                      onOpenChange(false);
                      return "Marked as read";
                    },
                    error: (res) => {
                      onOpenChange(false);
                      return getErrorMessage(res);
                    },
                  });
                }}
              >
                <X className="w-4 h-4 text-foreground/50" />
              </button>
              <p className="text-sm">
                <Markdown>{notification.message}</Markdown>
              </p>
              <div className="flex justify-between items-center">
                <span className="block text-xs  text-muted-foreground">{notification.commonTime}</span>
                <span className="block text-xs text-muted-foreground">
                  {notification.humanReadableTime.length > 0 ? `${notification.humanReadableTime} ago` : "just now"}
                </span>
              </div>
            </div>
          ))}
          {currentNotifications.length === 0 && (
            <p className="text-center text-muted-foreground text-xs py-2">
              You are good for the day, zero notifications!
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
