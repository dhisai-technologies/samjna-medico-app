"use client";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { useExportCSV } from "@/lib/hooks/export-csv";
import type { Analytics, CSV } from "@/lib/types";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/components/ui/chart";
import { Upload } from "lucide-react";

interface EyeTrackingProps {
  analytics: Analytics["eye_tracking"];
  csv?: CSV["fer"];
}

export function EyeTracking({ analytics, csv }: EyeTrackingProps) {
  const total = analytics.duration ? Math.round(analytics.duration) * 2 : 200;
  const chartData = [{ blinks: analytics.total_blinks, steady: total - analytics.total_blinks }];
  const chartConfig = {
    blinks: {
      label: "Blinks",
      color: "#E76E50",
    },
    steady: {
      label: "Steady",
      color: "#299D90",
    },
  } satisfies ChartConfig;
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
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={130}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          {analytics.total_blinks}/{total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                          Blinks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="blinks"
              stackId="a"
              cornerRadius={5}
              fill="#E76E50"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="steady"
              fill="#299D90"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-muted-foreground">
          Average blink duration is approximately {Math.fround(analytics.average_blink_duration).toFixed(3)}
        </div>
      </CardFooter>
    </Card>
  );
}
