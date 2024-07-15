import cors from "cors";
import express, { type Express } from "express";
import morgan from "morgan";

import Router from "@/routes";
import { AppError, errorHandler } from "@/utils/errors";

import { config } from "@/config";

export const createServer = (): Express => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(express.static("public"))
    .use(cors())
    .get("/health", (_, res) => {
      return res.json({ ok: true });
    });

  app.use(`/${config.VERSION}`, Router);

  // Catch all 404 errors
  app.use("*", (req, _res, next) => {
    next(new AppError(`can't find the route: ${req.originalUrl} on ${config.NAME}`, 404));
  });

  // Global Error handler
  app.use(errorHandler);

  return app;
};
