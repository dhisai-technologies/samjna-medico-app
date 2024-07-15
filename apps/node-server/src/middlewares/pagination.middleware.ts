import { type AppController, catchAsync } from "@/utils/errors";

export const parsePagination: AppController = catchAsync(async (req, _res, next) => {
  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  req.pagination = {
    page,
    limit,
    skip,
  };
  next();
});
