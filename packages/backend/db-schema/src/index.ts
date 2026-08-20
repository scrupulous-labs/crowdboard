import { defineRelations } from "drizzle-orm";

import { userAccounts, userAccountRelations } from "./user-accounts";
import { userSessions, userSessionRelations } from "./user-sessions";
import { users, userRelations } from "./users";
import { verifications } from "./verifications";

export { userAccounts } from "./user-accounts";
export { userSessions } from "./user-sessions";
export { users } from "./users";
export { verifications } from "./verifications";

export const schema = {
  users,
  userAccounts,
  userSessions,
  verifications,
};

export const relations = {
  ...defineRelations(schema, () => ({})),
  ...userRelations,
  ...userSessionRelations,
  ...userAccountRelations,
};
