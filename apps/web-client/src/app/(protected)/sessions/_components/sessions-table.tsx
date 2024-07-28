"use client";

import * as React from "react";

import { DataTable } from "@ui/components/data-table/data-table";
import { DataTableToolbar } from "@ui/components/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";
import type { DataTableFilterField } from "@ui/types";

import type { Session } from "@/lib/types";
import { getColumns } from "./sessions-table-columns";

interface SessionsTableProps {
  pageCount: number;
  data: Session[];
}

export function SessionsTable({ data, pageCount }: SessionsTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Session>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by id, email..",
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
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
