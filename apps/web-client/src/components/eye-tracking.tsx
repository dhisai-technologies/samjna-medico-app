"use client";

import { useExportCSV } from "@/lib/hooks/export-csv";
import type { Analytics, CSV } from "@/lib/types";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { ScanEye, Upload } from "lucide-react";

interface EyeTrackingProps {
  analytics: Analytics["eye_tracking"];
  csv?: CSV["fer"];
}

export function EyeTracking({ analytics, csv }: EyeTrackingProps) {
  const downloadCSV = useExportCSV();
  return (
    <Card className="relative flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Eye Tracking</CardTitle>
        <CardDescription>Eye blinking and average duration</CardDescription>
      </CardHeader>
      {csv && (
        <Button
          variant="secondary"
          onClick={() => {
            downloadCSV(JSON.parse(csv as unknown as string), "eye-tracking.csv");
          }}
          size="icon"
          className="absolute top-3 right-3"
        >
          <Upload className="w-4 h-4" />
        </Button>
      )}
      <CardContent className="flex flex-1 flex-col justify-center items-center gap-3 pb-0">
        <ScanEye className="text-primary" />
        <h3>
          Number of blinks: <b>{analytics.total_blinks}</b>
        </h3>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-muted-foreground">
          Average blink duration is approximately {Math.fround(analytics.average_blink_duration).toFixed(3)} seconds
        </div>
      </CardFooter>
    </Card>
  );
}
