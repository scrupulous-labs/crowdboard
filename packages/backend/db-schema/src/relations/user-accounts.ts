import { defineRelationsPart } from "drizzle-orm";

import { schema } from "../schema";

export const userAccountRelations = defineRelationsPart(schema, (r) => ({
  userAccounts: {
    user: r.one.users({
      from: r.userAccounts.userId,
      to: r.users.id,
    }),
  },
}));
