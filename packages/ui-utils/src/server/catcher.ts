import type { ServerActionResponse } from "../types";

export const catchAsync = <T extends Array<unknown>, U>(fn: (..._args: T) => Promise<U>) => {
  return async (...args: T): Promise<ServerActionResponse> => {
    let response: ServerActionResponse = null;
    try {
      response = (await fn(...args)) as ServerActionResponse;
    } catch (err) {
      console.error("💥 Error: ", err);
      return {
        error: "Something went wrong, please try again later",
      };
    }
    return response;
  };
};
