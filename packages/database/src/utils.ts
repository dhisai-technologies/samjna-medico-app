import { customAlphabet } from "nanoid";

interface GenerateIdOptions {
  length?: number;
  separator?: string;
}

export function generateId(prefix?: string, { length = 12, separator = "_" }: GenerateIdOptions = {}) {
  const id = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", length)();
  return prefix ? `${prefix}${separator}${id}` : id;
}
