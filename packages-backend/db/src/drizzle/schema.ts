import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  avatarUrl: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(date()).notNull(),
})

export const workspaces = pgTable("workspaces", {
  id: text().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  logoUrl: text(),
  metadata: text(),
  createdAt: timestamp().notNull(),
})

export const workspaceMembers = pgTable("workspaceMembers", {
  id: text().primaryKey(),
  userId: text().notNull().references(usersTable()),
  workspaceId: text().notNull().references(workspacesTable()),
  role: text().default("member").notNull(),
  firstName: text().notNull(),
  lastName: text(),
  avatarUrl: text(),
  createdAt: timestamp().notNull(),
})

export const teams = pgTable("teams", {
  id: text().primaryKey(),
  workspaceId: text().notNull().references(workspacesTable()),
  name: text().notNull(),
  memberCount: integer().default(0).notNull(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
})

export const teamMembers = pgTable("teamMembers", {
  id: text().primaryKey(),
  userId: text().notNull().references(usersTable()),
  teamId: text().notNull().references(teamsTable()),
  membershipKey: text(),
  createdAt: timestamp(),
})

export const accounts = pgTable("accounts", {
  id: text().primaryKey(),
  userId: text().notNull().references(usersTable()),
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
  updatedAt: timestamp().$onUpdate(date()).notNull(),
})

export const invitations = pgTable("invitations", {
  id: text().primaryKey(),
  inviterId: text().notNull().references(usersTable()),
  workspaceId: text().notNull().references(workspacesTable()),
  teamId: text(),
  email: text().notNull(),
  role: text(),
  status: text().default("pending").notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

export const userSessions = pgTable("userSessions", {
  id: text().primaryKey(),
  userId: text().notNull().references(usersTable()),
  token: text().notNull().unique(),
  expiresAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  activeTeamId: text(),
  activeWorkspaceId: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(date()).notNull(),
})

export const verifications = pgTable("verifications", {
  id: text().primaryKey(),
  value: text().notNull(),
  identifier: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(date()).notNull(),
})

export const schema = {
  users,
  workspaces,
  workspaceMembers,
  teams,
  teamMembers,
  accounts,
  invitations,
  userSessions,
  verifications,
}

// Utils
function date() {
  return () => new Date()
}

function usersTable() {
  return () => users.id
}

function workspacesTable() {
  return () => workspaces.id
}

function teamsTable() {
  return () => teams.id
}
