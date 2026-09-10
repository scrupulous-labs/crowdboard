import { defineRelationsPart, defineRelations } from "drizzle-orm"

import { schema } from "./schema"

export const authRelations = defineRelationsPart(schema, (r) => ({
  users: {
    userSessions: r.many.userSessions({
      from: r.users.id,
      to: r.userSessions.userId,
    }),
    accounts: r.many.accounts({
      from: r.users.id,
      to: r.accounts.userId,
    }),
    teamMembers: r.many.teamMembers({
      from: r.users.id,
      to: r.teamMembers.userId,
    }),
    invitations: r.many.invitations({
      from: r.users.id,
      to: r.invitations.inviterId,
    }),
  },
  userSessions: {
    users: r.one.users({
      from: r.userSessions.userId,
      to: r.users.id,
    }),
  },
  accounts: {
    users: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },
  workspaces: {
    teams: r.many.teams({
      from: r.workspaces.id,
      to: r.teams.workspaceId,
    }),
    workspaceMembers: r.many.workspaceMembers({
      from: r.workspaces.id,
      to: r.workspaceMembers.workspaceId,
    }),
    invitations: r.many.invitations({
      from: r.workspaces.id,
      to: r.invitations.workspaceId,
    }),
  },
  teams: {
    workspaces: r.one.workspaces({
      from: r.teams.workspaceId,
      to: r.workspaces.id,
    }),
    teamMembers: r.many.teamMembers({
      from: r.teams.id,
      to: r.teamMembers.teamId,
    }),
  },
  teamMembers: {
    teams: r.one.teams({
      from: r.teamMembers.teamId,
      to: r.teams.id,
    }),
    users: r.one.users({
      from: r.teamMembers.userId,
      to: r.users.id,
    }),
  },
  workspaceMembers: {
    workspaces: r.one.workspaces({
      from: r.workspaceMembers.workspaceId,
      to: r.workspaces.id,
    }),
    users: r.one.users({
      from: r.workspaceMembers.userId,
      to: r.users.id,
    }),
  },
  invitations: {
    workspaces: r.one.workspaces({
      from: r.invitations.workspaceId,
      to: r.workspaces.id,
    }),
    users: r.one.users({
      from: r.invitations.inviterId,
      to: r.users.id,
    }),
  },
}))

export const relations = {
  ...defineRelations(schema),
  ...authRelations,
}
