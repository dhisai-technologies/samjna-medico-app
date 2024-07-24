export type File = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  key: string;
  mimetype: string;
  size: number;
  isPublic: boolean;
  readableBy: unknown;
  readableUpto: Date;
};
