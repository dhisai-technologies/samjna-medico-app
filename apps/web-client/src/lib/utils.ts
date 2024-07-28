import type { ChartConfig } from "@ui/components/ui/chart";
import type { Analytics } from "./types";

export function getFERData(data: Analytics["fer"]) {
  const labels = Object.keys(data.class_wise_frame_count);
  const chartConfig = {
    percentage: {
      label: "Percentage",
    },
    sad: {
      label: "Sad",
      color: "#1E90FF",
    },
    fear: {
      label: "Fear",
      color: "#2E2B5F",
    },
    angry: {
      label: "Angry",
      color: "#8B0000",
    },
    happy: {
      label: "Happy",
      color: "#B8860B",
    },
    disgust: {
      label: "Disgust",
      color: "#3A5F0B",
    },
    neutral: {
      label: "Neutral",
      color: "#505050",
    },
    surprised: {
      label: "Surprised",
      color: "#FF8C00",
    },
  } satisfies ChartConfig;
  const total = Object.values(data.class_wise_frame_count).reduce((acc, curr) => acc + curr, 0);
  const getPercentage = (value: number) => Math.round((value / total) * 100);
  const getColor = (value: keyof Analytics["fer"]["class_wise_frame_count"]) => chartConfig[value]?.color;
  const chartData = [
    { emotion: "sad", percentage: getPercentage(data.class_wise_frame_count.sad), fill: getColor("sad") },
    { emotion: "fear", percentage: getPercentage(data.class_wise_frame_count.fear), fill: getColor("fear") },
    { emotion: "angry", percentage: getPercentage(data.class_wise_frame_count.angry), fill: getColor("angry") },
    { emotion: "happy", percentage: getPercentage(data.class_wise_frame_count.happy), fill: getColor("happy") },
    { emotion: "disgust", percentage: getPercentage(data.class_wise_frame_count.disgust), fill: getColor("disgust") },
    { emotion: "neutral", percentage: getPercentage(data.class_wise_frame_count.neutral), fill: getColor("neutral") },
    {
      emotion: "surprised",
      percentage: getPercentage(data.class_wise_frame_count.surprised),
      fill: getColor("surprised"),
    },
  ];
  return { chartData: chartData.filter(({ percentage }) => percentage > 0), chartConfig, labels };
}
