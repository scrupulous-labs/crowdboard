import { defineRelationsPart } from "drizzle-orm";

import { schema } from "../schema";

export const workspaceRelations = defineRelationsPart(schema, (r) => ({
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
