import { defineRelations } from "drizzle-orm";

import { schema } from "../schema";
import { invitationRelations } from "./invitations";
import { userAccountRelations } from "./user-accounts";
import { userSessionRelations } from "./user-sessions";
import { userRelations } from "./users";
import { workspaceMemberRelations } from "./workspace-members";
import { workspaceRelations } from "./workspaces";

export const relations = {
  ...defineRelations(schema),
  ...userAccountRelations,
  ...userSessionRelations,
  ...userRelations,
  ...workspaceRelations,
  ...workspaceMemberRelations,
  ...invitationRelations,
};
