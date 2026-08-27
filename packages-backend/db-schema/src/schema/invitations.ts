import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const invitations = pgTable("invitations", {
  id: text().primaryKey(),
  inviterId: text().notNull(),
  workspaceId: text().notNull(),
  email: text().notNull(),
  role: text(),
  status: text().default("pending").notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
