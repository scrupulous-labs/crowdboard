import { defineRelationsPart } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

import { userAccounts } from "./user-accounts";
import { userSessions } from "./user-sessions";

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  image: text(),
  email: text().notNull(),
  emailVerified: boolean().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userRelations = defineRelationsPart({ users, userSessions, userAccounts }, (r) => ({
  users: {
    sessions: r.many.userSessions({
      from: r.users.id,
      to: r.userSessions.userId,
    }),
    accounts: r.many.userAccounts({
      from: r.users.id,
      to: r.userAccounts.userId,
    }),
  },
}));
