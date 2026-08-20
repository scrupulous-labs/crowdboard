import { defineRelationsPart } from "drizzle-orm";

import { schema } from "../schema";

export const invitationRelations = defineRelationsPart(schema, (r) => ({
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
