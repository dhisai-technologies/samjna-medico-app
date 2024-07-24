import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";

export default function SessionsPage() {
  return (
    <main className="p-3 md:p-6">
      <Card className="space-y-6 w-full md:w-[75vw] mx-auto flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>Sessions</CardTitle>
          <CardDescription>View and analyze previous sessions</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent />
      </Card>
    </main>
  );
}
