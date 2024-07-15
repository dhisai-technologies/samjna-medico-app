export const loggerConfig = {
  exchange: "logs",
  type: "direct",
  routingKeys: {
    TRACE: "trace",
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
    FATAL: "fatal",
  },
} as const;
