export const roles = ["ADMIN", "DOCTOR", "EMPLOYEE", "INTERN"] as const;

export type Role = (typeof roles)[number];

export type User = {
  id: number;
  email: string;
  name: string;
  role: Role;
  active: boolean;
};
