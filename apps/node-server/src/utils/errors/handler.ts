import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodIssue } from "zod";

import { AppError } from "@/utils/errors";

import { StatusCodes } from "./status-codes";

const handleJWTError = () => new AppError("Invalid Token! Please Login Again", StatusCodes.UNAUTHORIZED);

const handleJWTExpiredError = () => new AppError("Your Token Expired! Please Login Again", StatusCodes.UNAUTHORIZED);

const handleZodError = (err: ZodError) => {
  if (err.errors.length === 0) {
    return new AppError("An unknown validation error occurred.", StatusCodes.BAD_REQUEST);
  }

  const firstError = err.errors[0] as ZodIssue;
  const path = firstError.path.join(" -> ");
  const errorMessage = `Error in ${path}: ${firstError.message}`;

  return new AppError(errorMessage, StatusCodes.BAD_REQUEST);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const sendErrorDev = (err: any, res: Response) => {
  if (!err.isOperational) {
    console.error("ERROR!💥💥💥", err);
  } else {
    console.info("Error: ", err.message);
  }
  return res.status(err.statusCode).json({
    status: "failure",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const sendErrorProd = (err: any, res: Response) => {
  // Operational created by user
  if (err.isOperational) {
    console.info("Error: ", err.message);
    return res.status(err.statusCode).json({
      status: "failure",
      message: err.message,
    });
  }
  //Programming or unknown error
  console.error("ERROR!💥💥💥", err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "failure",
    message: "Something went wrong, please try again later!",
  });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = err;
  if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  }
  if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }
  if (err instanceof ZodError) {
    error = handleZodError(err);
  }
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
}
