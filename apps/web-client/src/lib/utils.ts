import type { ChartConfig } from "@ui/components/ui/chart";
import type { Analytics } from "./types/analytics";

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
      color: "#483D8B",
    },
    angry: {
      label: "Angry",
      color: "#FF0000",
    },
    happy: {
      label: "Happy",
      color: "#FFFF00",
    },
    disgust: {
      label: "Disgust",
      color: "#556B2F",
    },
    neutral: {
      label: "Neutral",
      color: "#808080",
    },
    surprised: {
      label: "Surprised",
      color: "#FFA500",
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
      emotion: "Surprised",
      percentage: getPercentage(data.class_wise_frame_count.surprised),
      fill: getColor("surprised"),
    },
  ];
  return { chartData: chartData.filter(({ percentage }) => percentage > 0), chartConfig, labels };
}
