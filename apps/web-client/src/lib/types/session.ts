import type { Analytics, CSV } from "./analytics";

export type Session = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  key: string | null;
  uid: string;
  analytics?: Analytics | null;
  csv?: CSV | null;
  user: {
    id: number;
    email: string;
    name: string;
    profile?: string;
  };
};
