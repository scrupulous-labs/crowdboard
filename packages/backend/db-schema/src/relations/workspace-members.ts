import { defineRelationsPart } from "drizzle-orm";

import { schema } from "../schema";

export const workspaceMemberRelations = defineRelationsPart(schema, (r) => ({
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
