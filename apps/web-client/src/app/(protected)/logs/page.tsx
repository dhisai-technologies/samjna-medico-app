import { config, retrieve } from "@ui-utils/server";

import type { Log } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import type { SearchParams } from "@ui/types";
import { LogsTable } from "./_components/logs-table";

async function getLogs(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(`${config.API_URL}/v1/logs?${queryParams}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message ?? "Failed to fetch data");
  }
  const { pageCount, logs } = result.data as {
    logs: Log[];
    pageCount: number;
  };
  return {
    pageCount,
    logs,
  };
}

export default async function LogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { pageCount, logs } = await getLogs(searchParams);
  return (
    <main className="p-3 md:p-6">
      <Card className="space-y-6 w-full md:w-[75vw] mx-auto flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>Logs</CardTitle>
          <CardDescription>View your users logs and traces.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <LogsTable data={logs} pageCount={pageCount} />
        </CardContent>
      </Card>
    </main>
  );
}
