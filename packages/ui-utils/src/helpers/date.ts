import { formatDuration, intervalToDuration } from "date-fns";

export const formatToHumanReadable = (time: Date) => {
  const start = new Date(time).getTime();
  const end = Date.now();
  const durations = intervalToDuration({
    start: new Date(time).getTime(),
    end: Date.now(),
  });
  if (end - start < 3600 * 1000) {
    return formatDuration(durations, {
      format: ["hours", "minutes", "seconds"],
    });
  }
  if (end - start >= 3600 * 24 * 365.25 * 1000) {
    return formatDuration(durations, {
      format: ["years"],
    });
  }
  return formatDuration(durations, {
    format: ["hours", "days", "weeks", "months", "years"],
  });
};
