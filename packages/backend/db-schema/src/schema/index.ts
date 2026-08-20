import { invitations } from "./invitations";
import { userAccounts } from "./user-accounts";
import { userSessions } from "./user-sessions";
import { users } from "./users";
import { verifications } from "./verifications";
import { workspaceMembers } from "./workspace-members";
import { workspaces } from "./workspaces";

export { userAccounts } from "./user-accounts";
export { userSessions } from "./user-sessions";
export { users } from "./users";
export { verifications } from "./verifications";
export { invitations } from "./invitations";
export { workspaces } from "./workspaces";
export { workspaceMembers } from "./workspace-members";

export const schema = {
  users,
  userSessions,
  userAccounts,
  verifications,
  workspaces,
  workspaceMembers,
  invitations,
};
