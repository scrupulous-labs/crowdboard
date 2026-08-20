import { defineRelationsPart } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

export const userAccounts = pgTable("userAccounts", {
  id: text().primaryKey(),
  userId: text().notNull(),
  issuer: text().notNull(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  scope: text(),
  password: text(),
  idToken: text(),
  accessToken: text(),
  refreshToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userAccountRelations = defineRelationsPart({ users, userAccounts }, (r) => ({
  userAccounts: {
    user: r.one.users({
      from: r.userAccounts.userId,
      to: r.users.id,
    }),
  },
}));
