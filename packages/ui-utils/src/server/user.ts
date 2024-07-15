import { headers } from "next/headers";

import type { User } from "../types";

export const getUser = () => {
  const user = headers().get("x-next-user");
  if (user && typeof user === "string") {
    return JSON.parse(user) as User;
  }
  return {
    id: 0,
    email: "",
    name: "",
    role: "EMPLOYEE",
  } as User;
};
