"use client";
import { LabelList, Pie, PieChart } from "recharts";

import { useExportCSV } from "@/lib/hooks/export-csv";
import type { Analytics, CSV } from "@/lib/types";
import { getFERData } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/components/ui/chart";
import { Upload } from "lucide-react";

interface FERProps {
  analytics: Analytics["fer"];
  csv?: CSV["fer"];
}

export function FER({ analytics, csv }: FERProps) {
  const { chartConfig, chartData } = getFERData(analytics);
  const downloadCSV = useExportCSV();
  return (
    <Card className="relative flex flex-col h-[400px] col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Emotions</CardTitle>
        <CardDescription>Facial Emotion Recognition Analytics</CardDescription>
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
      <CardContent className="flex-1 flex flex-row pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="percentage" hideLabel />} />
            <Pie
              data={chartData}
              dataKey="percentage"
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.percentage}
                  </text>
                );
              }}
              nameKey="emotion"
            >
              <LabelList
                dataKey="emotion"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
