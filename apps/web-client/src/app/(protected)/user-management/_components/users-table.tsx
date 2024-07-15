"use client";

import type { User } from "@ui-utils/types";

import * as React from "react";

import { DataTable } from "@ui/components/data-table/data-table";
import { DataTableToolbar } from "@ui/components/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";
import type { DataTableFilterField } from "@ui/types";

import { CreateOrganizationDialog } from "./create-user-dialog";
import { getColumns } from "./users-table-columns";

interface UsersTableProps {
  pageCount: number;
  data: User[];
}

export function UsersTable({ data, pageCount }: UsersTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<User>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by name, email..",
    },
    {
      label: "Roles",
      value: "role",
      placeholder: "Filter by roles",
      options: [
        { label: "Doctor", value: "DOCTOR" },
        { label: "Employee", value: "EMPLOYEE" },
        { label: "Intern", value: "INTERN" },
      ],
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    defaultPerPage: 5,
  });

  return (
    <DataTable table={table} className="w-full">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <div className="flex items-center gap-2">
          <CreateOrganizationDialog />
        </div>
      </DataTableToolbar>
    </DataTable>
  );
}
