"use client";

import * as React from "react";

import { DataTable } from "@ui/components/data-table/data-table";
import { DataTableToolbar } from "@ui/components/data-table/data-table-toolbar";
import { useDataTable } from "@ui/hooks/use-data-table";
import type { DataTableFilterField } from "@ui/types";

import type { File } from "@/lib/types";
import { getColumns } from "./storage-table-columns";
import { UploadFileDialog } from "./upload-file-dialog";

interface StorageTableProps {
  pageCount: number;
  data: File[];
}

export function StorageTable({ data, pageCount }: StorageTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<File>[] = [
    {
      label: "Search",
      value: "search",
      placeholder: "Search by id, name, key or owner email..",
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

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <UploadFileDialog />
      </DataTableToolbar>
    </DataTable>
  );
}
