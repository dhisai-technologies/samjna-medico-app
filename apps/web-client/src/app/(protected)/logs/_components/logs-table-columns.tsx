"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@ui/components/data-table/data-table-column-header";
import { Badge } from "@ui/components/ui/badge";

import { type Log, logLevels } from "@/lib/types";
import { Checkbox } from "@ui/components/ui/checkbox";
import { format } from "date-fns";

export function getColumns(): ColumnDef<Log>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "level",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Level" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("level")}</span>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "message",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
      cell: ({ row }) => {
        const level = logLevels.find((level) => level === row.original.level);
        return (
          <div className="flex space-x-2">
            {level && <Badge variant="outline">{level}</Badge>}
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("message")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "event",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Event" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue("event")}</span>
          </div>
        );
      },
    },
    {
      id: "user.email",
      accessorKey: "user.email",
      header: "Email",
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
      cell: ({ row }) => <span>{format(row.original.createdAt, "ccc dd MMM hh:mm a")}</span>,
    },
  ];
}
