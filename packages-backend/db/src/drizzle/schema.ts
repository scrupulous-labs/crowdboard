import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const users = pgTable("users", {
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

const workspaces = pgTable("workspaces", {
  id: text().primaryKey(),
  name: text().notNull(),
  slug: text().notNull(),
  logo: text(),
  metadata: text(),
  createdAt: timestamp().notNull(),
});

const teams = pgTable("teams", {
  id: text().primaryKey(),
  workspaceId: text().notNull(),
  name: text().notNull(),
  memberCount: integer().notNull(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp(),
});

const workspaceMembers = pgTable("workspaceMembers", {
  id: text().primaryKey(),
  userId: text().notNull(),
  workspaceId: text().notNull(),
  role: text().default("member").notNull(),
  createdAt: timestamp().notNull(),
});

const teamMemebers = pgTable("teamMembers", {
  id: text().primaryKey(),
  userId: text().notNull(),
  teamId: text().notNull(),
  membershipKey: text(),
  createdAt: timestamp(),
});

const accounts = pgTable("accounts", {
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

const invitations = pgTable("invitations", {
  id: text().primaryKey(),
  inviterId: text().notNull(),
  workspaceId: text().notNull(),
  email: text().notNull(),
  role: text(),
  status: text().default("pending").notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

const userSessions = pgTable("userSessions", {
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

const verifications = pgTable("verifications", {
  id: text().primaryKey(),
  value: text().notNull(),
  identifier: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const schema = {
  users,
  workspaces,
  teams,
  workspaceMembers,
  teamMemebers,
  accounts,
  invitations,
  userSessions,
  verifications,
};
