"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@ui/components/data-table/data-table-column-header";

import { getFile } from "@/lib/actions";
import type { File } from "@/lib/types";
import { formatBytes, getErrorMessage } from "@ui-utils/helpers";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { useAuth } from "@ui/providers/auth-provider";
import { format } from "date-fns";
import { BarChart2, Ellipsis, Globe, Link, PencilLine, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteFile } from "../_lib/actions";

export function getColumns(): ColumnDef<File>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "mimetype",
      header: "Mimetype",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("mimetype")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{formatBytes(row.original.size)}</span>
          </div>
        );
      },
    },
    {
      id: "user.email",
      accessorKey: "user.email",
      header: "Owner",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("user.email")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <span>{format(row.original.createdAt, "ccc dd MMM hh:mm a")}</span>,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const { user } = useAuth();
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onSelect={() => {}} className="space-x-2 cursor-pointer">
                  <BarChart2 className="w-3 h-3" />
                  <span>Inference</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    toast.promise(getFile(row.original.id), {
                      loading: "Copying to clipboard...",
                      success: (res) => {
                        navigator.clipboard.writeText(res.url);
                        return "Copied to clipboard";
                      },
                      error: (res) => {
                        return getErrorMessage(res);
                      },
                    });
                  }}
                  className="space-x-2 cursor-pointer"
                >
                  <Link className="w-3 h-3" />
                  <span>Copy URL</span>
                </DropdownMenuItem>
                {user?.id === row.original.userId && (
                  <>
                    <DropdownMenuItem onSelect={() => {}} className="space-x-2 cursor-pointer">
                      <PencilLine className="w-3 h-3" />
                      <span>Rename file</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {}} className="space-x-2 cursor-pointer">
                      <Globe className="w-3 h-3" />
                      <span>Mark as public</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        toast.promise(deleteFile(row.original.id), {
                          loading: "Deleting file...",
                          success: () => {
                            return "File deleted successfully";
                          },
                          error: (res) => {
                            return getErrorMessage(res);
                          },
                        });
                      }}
                      className="space-x-2 cursor-pointer"
                    >
                      <Trash className="w-3 h-3 text-destructive" />
                      <span className="text-destructive">Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
