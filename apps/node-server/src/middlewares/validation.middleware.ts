import type { AnyZodObject } from "zod";

import { type AppController, catchAsync } from "@/utils/errors";

export const validateRequest = (schema: AnyZodObject): AppController =>
  catchAsync(async (req, _res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  });
