import { config, retrieve } from "@ui-utils/server";
import type { User } from "@ui-utils/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import type { SearchParams } from "@ui/types";
import { UsersTable } from "./_components/users-table";

async function getUsers(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(`${config.API_URL}/v1/users?${queryParams}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message ?? "Failed to fetch data");
  }
  const { pageCount, users } = result.data as {
    users: User[];
    pageCount: number;
  };
  return {
    pageCount,
    users,
  };
}

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { pageCount, users } = await getUsers(searchParams);
  return (
    <main className="p-3 md:p-6">
      <Card className="space-y-6 w-full md:w-[75vw] mx-auto flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your users details and accessibility.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <UsersTable data={users} pageCount={pageCount} />
        </CardContent>
      </Card>
    </main>
  );
}
