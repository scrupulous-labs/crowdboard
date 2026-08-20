import { defineRelationsPart } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

export const userSessions = pgTable("userSessions", {
  id: text().primaryKey(),
  userId: text().notNull(),
  token: text().notNull(),
  expiresAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userSessionRelations = defineRelationsPart({ users, userSessions }, (r) => ({
  userSessions: {
    user: r.one.users({
      from: r.userSessions.userId,
      to: r.users.id,
    }),
  },
}));
