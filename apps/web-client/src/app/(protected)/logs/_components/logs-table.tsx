"use client";

import * as React from "react";

import { DataTable } from "@ui/components/data-table/data-table";
import { DataTableToolbar } from "@ui/components/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";
import type { DataTableFilterField } from "@ui/types";

import { type Log, logLevels } from "@/lib/types";
import { convertEnumToReadableFormat } from "@ui-utils/helpers";
import { Button } from "@ui/components/ui/button";
import { useExport } from "@ui/hooks/use-export";
import { Download } from "lucide-react";
import { getColumns } from "./logs-table-columns";

interface LogsTableProps {
  pageCount: number;
  data: Log[];
}

export function LogsTable({ data, pageCount }: LogsTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Log>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by message, event, email..",
    },
    {
      label: "Level",
      value: "level",
      placeholder: "Filter by level",
      options: logLevels.map((level) => ({ label: convertEnumToReadableFormat(level), value: level })),
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    defaultPerPage: 5,
    hiddenColumns: {
      level: false,
    },
  });

  const { exportToCSV } = useExport<Log>({
    filename: "logs",
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <div className="flex items-center gap-2">
          <Button disabled={!table.getIsSomeRowsSelected()} variant="outline" onClick={() => exportToCSV(table)}>
            <Download className="mr-2 size-4" aria-hidden="true" />
            Export
          </Button>
        </div>
      </DataTableToolbar>
    </DataTable>
  );
}
