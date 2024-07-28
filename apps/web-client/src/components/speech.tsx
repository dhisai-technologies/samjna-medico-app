"use client";

import type { Analytics, CSV } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";

interface SpeechProps {
  analytics: Analytics["speech"];
  csv?: CSV["fer"];
}

export function Speech({ analytics }: SpeechProps) {
  console.log(analytics);
  return (
    <Card className="relative flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Speech</CardTitle>
        <CardDescription>Vocal analysis</CardDescription>
      </CardHeader>
    </Card>
  );
}
