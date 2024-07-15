import type { User } from "../types";

export function getRoleBasedNav(
  sidebar: {
    title: string;
    href: string;
    active: string;
  }[],
  role: User["role"] = "EMPLOYEE",
  exclude: Record<string, string[]> = {},
) {
  return sidebar.filter((item) => {
    for (const key of Object.keys(exclude)) {
      if (key === role && exclude[key]?.includes(item.title)) {
        return false;
      }
    }
    return true;
  });
}
