export const notifierConfig = {
  exchange: "notifications",
  type: "direct",
  routingKeys: {
    DEFAULT: "default",
    IMPORTANT: "important",
  },
  types: ["COMMON"],
} as const;
