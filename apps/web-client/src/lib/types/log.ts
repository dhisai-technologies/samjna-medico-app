export const logLevels = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"] as const;
export type LogLevel = (typeof logLevels)[number];

export type Log = {
  id: string;
  organizationId: number | null;
  userId: number;
  message: string;
  event: string | null;
  level: LogLevel;
  createdAt: Date;
  user: {
    id: number;
    email: string;
    name: string;
    profile?: string;
  };
};
