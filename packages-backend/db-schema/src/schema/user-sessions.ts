import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userSessions = pgTable("userSessions", {
  id: text().primaryKey(),
  userId: text().notNull(),
  token: text().notNull(),
  expiresAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  activeOrganizationId: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
});
