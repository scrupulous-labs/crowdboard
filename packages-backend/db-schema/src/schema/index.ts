import { invitations } from "./invitations";
import { userAccounts } from "./user-accounts";
import { userSessions } from "./user-sessions";
import { users } from "./users";
import { verifications } from "./verifications";
import { workspaceMembers } from "./workspace-members";
import { workspaces } from "./workspaces";

export * from "./user-accounts";
export * from "./user-sessions";
export * from "./users";
export * from "./verifications";
export * from "./invitations";
export * from "./workspaces";
export * from "./workspace-members";

export const schema = {
  users,
  userSessions,
  userAccounts,
  verifications,
  workspaces,
  workspaceMembers,
  invitations,
};
