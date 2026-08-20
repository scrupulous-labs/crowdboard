import { defineRelationsPart } from "drizzle-orm";

import { schema } from "../schema";

export const userSessionRelations = defineRelationsPart(schema, (r) => ({
  userSessions: {
    user: r.one.users({
      from: r.userSessions.userId,
      to: r.users.id,
    }),
  },
}));
