"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@ui/components/data-table/data-table-column-header";

import type { Session } from "@/lib/types";
import { getErrorMessage } from "@ui-utils/helpers";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { format } from "date-fns";
import { BarChart2, Ellipsis, Eye, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteSession } from "../_lib/actions";

export function getColumns(): ColumnDef<Session>[] {
  return [
    {
      id: "user.email",
      accessorKey: "user.email",
      header: "Analyzed By",
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
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
      cell: ({ row }) => <span>{format(row.original.updatedAt, "ccc dd MMM hh:mm a")}</span>,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const router = useRouter();
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  onSelect={() => {
                    router.push(`/sessions/${row.original.id}`);
                  }}
                  className="space-x-2 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    router.push(`/sessions/${row.original.id}?infer=true`);
                  }}
                  className="space-x-2 cursor-pointer"
                >
                  <BarChart2 className="w-3 h-3" />
                  <span>Re Infer</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    toast.promise(deleteSession(row.original.id), {
                      loading: "Deleting session...",
                      success: () => {
                        return "Session deleted successfully";
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
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
