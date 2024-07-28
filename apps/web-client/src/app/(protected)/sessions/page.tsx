import type { Session } from "@/lib/types";
import { config, retrieve } from "@ui-utils/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import type { SearchParams } from "@ui/types";
import { SessionsTable } from "./_components/sessions-table";

async function getSessions(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(`${config.API_URL}/v1/sessions?${queryParams}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message ?? "Failed to fetch data");
  }
  const { pageCount, sessions } = result.data as {
    sessions: Session[];
    pageCount: number;
  };
  return {
    pageCount,
    sessions,
  };
}

export default async function SessionsPage({ searchParams }: { searchParams: SearchParams }) {
  const { sessions, pageCount } = await getSessions(searchParams);
  return (
    <main className="p-3 md:p-6">
      <Card className="space-y-6 w-full md:w-[75vw] mx-auto flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>Sessions</CardTitle>
          <CardDescription>View and analyze previous sessions</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <SessionsTable data={sessions} pageCount={pageCount} />
        </CardContent>
      </Card>
    </main>
  );
}
