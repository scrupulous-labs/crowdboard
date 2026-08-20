import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const workspaceMembers = pgTable("workspaceMembers", {
  id: text().primaryKey(),
  userId: text().notNull(),
  workspaceId: text().notNull(),
  role: text().default("member").notNull(),
  createdAt: timestamp().notNull(),
});
