import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { generateId } from "./utils";

export const rolesEnum = pgEnum("role", ["ADMIN", "DOCTOR", "EMPLOYEE", "INTERN"]);

export const logLevelsEnum = pgEnum("log_level", ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name"),
  role: rolesEnum("role").default("EMPLOYEE").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(users, ({ many }) => ({
  notifications: many(notifications),
  logs: many(logs),
}));

export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  otp: varchar("otp", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  retries: integer("retries").default(0).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  userId: integer("user_id").notNull(),
  type: varchar("type", { length: 255 }).default("COMMON").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const logs = pgTable("logs", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId("LOG"))
    .primaryKey(),
  userId: integer("user_id").notNull(),
  organizationId: integer("organization_id"),
  level: logLevelsEnum("log_level").default("TRACE").notNull(),
  message: text("message").notNull(),
  event: varchar("event", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const logRelations = relations(logs, ({ one }) => ({
  user: one(users, {
    fields: [logs.userId],
    references: [users.id],
  }),
}));

export const files = pgTable("files", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull(),
  mimetype: text("mimetype").notNull(),
  size: doublePrecision("size").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  readableBy: jsonb("readable_by"),
  readableUpto: timestamp("readable_upto").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull().unique(),
  key: varchar("key", { length: 255 }),
  analytics: jsonb("analytics"),
  csv: jsonb("csv"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Log = typeof logs.$inferSelect;
export type File = typeof files.$inferSelect;
export type Session = typeof sessions.$inferSelect;
