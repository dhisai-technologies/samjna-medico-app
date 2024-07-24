import { useCallback } from "react";

// Define a type for the JSON object. Adjust according to the actual data structure.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type JsonDataItem = Record<string, any>;

export function useExportCSV() {
  const jsonToCSV = useCallback((jsonData: JsonDataItem[]) => {
    const csvRows = [];
    if (!jsonData[0]) return "";
    const headers = Object.keys(jsonData[0]);
    csvRows.push(headers.join(",")); // Add header row

    // Add data rows
    for (const row of jsonData) {
      const values = headers.map((header) => {
        const escaped = `${row[header]}`.replace(/"/g, '\\"'); // Escape double quotes
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }, []);

  const downloadCSV = useCallback(
    (jsonData: JsonDataItem[], filename: string) => {
      const csv = jsonToCSV(jsonData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [jsonToCSV],
  );

  return downloadCSV;
}
