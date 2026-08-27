import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

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
