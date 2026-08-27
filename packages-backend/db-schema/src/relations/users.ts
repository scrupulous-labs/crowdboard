import { defineRelationsPart } from "drizzle-orm";

import { schema } from "../schema";

export const userRelations = defineRelationsPart(schema, (r) => ({
  users: {
    sessions: r.many.userSessions({
      from: r.users.id,
      to: r.userSessions.userId,
    }),
    accounts: r.many.userAccounts({
      from: r.users.id,
      to: r.userAccounts.userId,
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
