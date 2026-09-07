import { defineRelationsPart, defineRelations } from "drizzle-orm";

import { schema } from "./schema";

const userRelations = defineRelationsPart(schema, (r) => ({
  users: {
    sessions: r.many.userSessions({
      from: r.users.id,
      to: r.userSessions.userId,
    }),
    accounts: r.many.accounts({
      from: r.users.id,
      to: r.accounts.userId,
    }),
    workspaces: r.many.workspaces({
      from: r.users.id.through(r.workspaceMembers.userId),
      to: r.workspaces.id.through(r.workspaceMembers.workspaceId),
    }),
    sentInvitations: r.many.invitations({
      from: r.users.id,
      to: r.invitations.inviterId,
    }),
  },
}));

const workspaceRelations = defineRelationsPart(schema, (r) => ({
  workspaces: {
    members: r.many.workspaceMembers({
      from: r.workspaces.id,
      to: r.workspaceMembers.workspaceId,
    }),
    invitations: r.many.invitations({
      from: r.workspaces.id,
      to: r.invitations.workspaceId,
    }),
  },
}));

const workspaceMemberRelations = defineRelationsPart(schema, (r) => ({
  workspaceMembers: {
    user: r.one.users({
      from: r.workspaceMembers.userId,
      to: r.users.id,
    }),
    workspace: r.one.workspaces({
      from: r.workspaceMembers.workspaceId,
      to: r.workspaces.id,
    }),
  },
}));

const accountRelations = defineRelationsPart(schema, (r) => ({
  accounts: {
    user: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },
}));

const invitationRelations = defineRelationsPart(schema, (r) => ({
  invitations: {
    inviter: r.one.users({
      from: r.invitations.inviterId,
      to: r.users.id,
    }),
    workspace: r.one.workspaces({
      from: r.invitations.workspaceId,
      to: r.workspaces.id,
    }),
  },
}));

const userSessionRelations = defineRelationsPart(schema, (r) => ({
  userSessions: {
    user: r.one.users({
      from: r.userSessions.userId,
      to: r.users.id,
    }),
  },
}));

export const relations = {
  ...defineRelations(schema),
  ...userRelations,
  ...workspaceRelations,
  ...workspaceMemberRelations,
  ...accountRelations,
  ...invitationRelations,
  ...userSessionRelations,
};
