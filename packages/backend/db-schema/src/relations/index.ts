import { defineRelations } from "drizzle-orm";

import { schema } from "../schema";
import { userAccountRelations } from "./user-accounts";
import { userSessionRelations } from "./user-sessions";
import { userRelations } from "./users";
import { invitationRelations } from "./invitations"
import { workspaceRelations } from "./workspaces"
import { workspaceMemberRelations } from "./workspace-members"

export const relations = {
  ...defineRelations(schema),
  ...userAccountRelations,
  ...userSessionRelations,
  ...userRelations,
  ...workspaceRelations,
  ...workspaceMemberRelations,
  ...invitationRelations,
};
