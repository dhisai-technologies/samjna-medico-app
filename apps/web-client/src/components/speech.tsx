"use client";

import { useExportCSV } from "@/lib/hooks/export-csv";
import type { Analytics, CSV } from "@/lib/types";
import { convertSnakeToReadable } from "@ui-utils/helpers";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Upload } from "lucide-react";

interface SpeechProps {
  analytics: Analytics["speech"];
  csv?: CSV["fer"];
}

export function Speech({ analytics, csv }: SpeechProps) {
  const downloadCSV = useExportCSV();
  return (
    <Card className="relative flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Speech</CardTitle>
        <CardDescription>Vocal analysis</CardDescription>
      </CardHeader>
      {csv && (
        <Button
          variant="secondary"
          onClick={() => {
            downloadCSV(JSON.parse(csv as unknown as string), "fer.csv");
          }}
          size="icon"
          className="absolute top-3 right-3"
        >
          <Upload className="w-4 h-4" />
        </Button>
      )}
      <CardContent className="flex flex-col justify-center flex-1">
        <dl className="grid gap-3 py-2">
          {Object.entries(analytics).map(([key, value]) => (
            <div className="flex gap-3 items-center justify-between" key={key}>
              <dt className="text-muted-foreground">{convertSnakeToReadable(key)}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
