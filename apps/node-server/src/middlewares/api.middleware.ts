import { config } from "@/config";
import { type AppController, AppError, catchAsync } from "@/utils/errors";

export const protectApi: AppController = catchAsync(async (req, _res, next) => {
  // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
  if (!req.headers.hasOwnProperty("x-api-key")) {
    throw new AppError("Not Authorized to access API", 401);
  }
  const key = req.headers["x-api-key"];
  if (key !== config.API_KEY) {
    throw new AppError("Not Authorized to access API", 401);
  }
  const { search } = req.query;
  if (typeof search === "string") {
    req.search = search;
  }

  next();
});
