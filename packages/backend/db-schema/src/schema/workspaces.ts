import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspaces", {
  id: text().primaryKey(),
  name: text().notNull(),
  slug: text().notNull(),
  logo: text(),
  metadata: text(),
  createdAt: timestamp().notNull(),
});
