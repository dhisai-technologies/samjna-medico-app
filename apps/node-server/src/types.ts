import type { Request } from "express";

export interface AppRequest<
  P = Request["params"],
  ResBody = any,
  ReqBody = any,
  ReqQuery = Request["query"],
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {}
