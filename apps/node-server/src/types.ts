import type { Request } from "express";

import type { User } from "@packages/database";

export interface Pagination {
  page: number;
  limit: number;
  skip: number;
}

export type FilterRule = "eq" | "between" | "isNull" | "ilike" | "notILike" | "inArray";

export interface Filter {
  column: string;
  rule: FilterRule;
  value: string;
}

export interface Sort {
  column: string;
  order: "asc" | "desc";
}

export interface AppRequest<
  P = Request["params"],
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ResBody = any,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ReqBody = any,
  ReqQuery = Request["query"],
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: User;
  id: string;
  driveFile: unknown;
  driveFolder: unknown;
  search?: string;
  pagination?: Pagination;
  filtering?: Filter[];
  sorting?: Sort;
}

export interface MulterS3File extends Express.Multer.File {
  key: string;
  location: string;
}
