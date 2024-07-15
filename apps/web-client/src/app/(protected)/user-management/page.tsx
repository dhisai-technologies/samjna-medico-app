import { config, retrieve } from "@ui-utils/server";
import type { User } from "@ui-utils/types";
import type { SearchParams } from "@ui/types";

import { Separator } from "@ui/components/ui/separator";
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
    <main className="space-y-6 w-[75vw] mx-auto flex flex-col">
      <div>
        <h3 className="text-lg font-medium">Users</h3>
        <p className="text-sm text-muted-foreground">Manage your users details and accessibility.</p>
      </div>
      <Separator />
      <UsersTable data={users} pageCount={pageCount} />
    </main>
  );
}
