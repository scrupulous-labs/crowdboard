import { Schema } from "effect";

import { UserId } from "./user";
import { WorkspaceId } from "./workspace";

export const WorkspaceMemberId = Schema.String.pipe(Schema.brand("models/db/workspace-member_id"));
export class WorkspaceMember extends Schema.Class<WorkspaceMember, { readonly brand: unique symbol }>(
  "models/db/workspace-member",
)({
  id: WorkspaceMemberId,
  userId: UserId,
  workspaceId: WorkspaceId,
  role: Schema.String,
  createdAt: Schema.Date,
}) {}
