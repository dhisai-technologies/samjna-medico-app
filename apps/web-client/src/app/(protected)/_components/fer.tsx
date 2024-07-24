"use client";
import { LabelList, Pie, PieChart } from "recharts";

import { useExportCSV } from "@/lib/hooks/export-csv";
import type { Analytics, CSV } from "@/lib/types/analytics";
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
  const { chartConfig, chartData, labels } = getFERData(analytics);
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
            downloadCSV(csv, "fer.csv");
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
            <Pie data={chartData} dataKey="percentage">
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
        <div className="p-4 text-xs">
          <div className="flex flex-col">
            <div className="flex border-border border-y border-l bg-muted">
              <div className="p-2 w-16 border-r border-border" />
              {labels.map((label) => (
                <div key={label} className="border-r border-border p-2 flex justify-center items-center w-16">
                  {label}
                </div>
              ))}
            </div>
            {analytics.matrix.map((row, rowIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={rowIndex} className="flex">
                <div className="border-x border-b border-border p-2 flex justify-center items-center w-16 bg-muted">
                  {labels[rowIndex]}
                </div>
                {row.map((value, colIndex) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={colIndex}
                    className="border-r border-b border-border p-2 flex justify-center items-center w-16"
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
