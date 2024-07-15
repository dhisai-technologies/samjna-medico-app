"use client";

import { convertEnumToReadableFormat, getErrorMessage } from "@ui-utils/helpers";
import type { User } from "@ui-utils/types";
import { toast } from "sonner";

import type { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, PencilLine, ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";

import { DataTableColumnHeader } from "@ui/components/data-table/data-table-column-header";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";

import { updateUserStatus } from "../_lib/actions";
import { UpdateUserSheet } from "./update-user-sheet";

export function getColumns(): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <Badge variant="outline">{row.original.active ? "Active" : "Inactive"}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("email")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <div className="flex w-[6.25rem] items-center">
            <Badge variant="outline">{convertEnumToReadableFormat(row.original.role)}</Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateUserSheet, setShowUpdateUserSheet] = useState(false);
        return (
          <>
            <UpdateUserSheet open={showUpdateUserSheet} onOpenChange={setShowUpdateUserSheet} user={row.original} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onSelect={() => setShowUpdateUserSheet(true)} className="space-x-2 cursor-pointer">
                  <PencilLine className="w-3 h-3" />
                  <span>Update Details</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    toast.promise(updateUserStatus(row.original.id, !row.original.active), {
                      loading: "Updating user status...",
                      success: "Updated user status successfully",
                      error: (err) => getErrorMessage(err),
                    });
                  }}
                  className="space-x-2 cursor-pointer"
                >
                  {row.original.active ? (
                    <ShieldX className="w-3 h-3 text-destructive" />
                  ) : (
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                  )}
                  {row.original.active ? (
                    <span className="text-destructive">Deactivate</span>
                  ) : (
                    <span className="text-green-500">Activate</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
