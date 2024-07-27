import { appConfig } from "@ui-utils/config";

export const config = {
  API_KEY: process.env.API_KEY || "",
  API_URL: appConfig.api.node,
};
