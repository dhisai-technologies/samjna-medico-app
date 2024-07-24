import type { File } from "@/lib/types";
import { config, retrieve } from "@ui-utils/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import type { SearchParams } from "@ui/types";
import { StorageTable } from "./_components/storage-table";

async function getFiles(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(
    `${config.API_URL}/v1/files?${queryParams.length > 0 ? queryParams : "sort=updatedAt:desc"}`,
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message ?? "Failed to fetch data");
  }
  const { pageCount, files, totalCount } = result.data as {
    files: File[];
    pageCount: number;
    totalCount: number;
  };
  return {
    pageCount,
    files,
    totalCount,
  };
}

export default async function StoragePage({ searchParams }: { searchParams: SearchParams }) {
  const { files, pageCount } = await getFiles(searchParams);
  return (
    <main className="p-3 md:p-6">
      <Card className="space-y-6 w-full md:w-[75vw] mx-auto flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>Storage</CardTitle>
          <CardDescription>View files and their details.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <StorageTable data={files} pageCount={pageCount} />
        </CardContent>
      </Card>
    </main>
  );
}
