import { Schema } from "effect";

import { UserId } from "./user";
import { WorkspaceId } from "./workspace";

export type WorkspaceMemberId = typeof WorkspaceMemberId.Type;
export const WorkspaceMemberId = Schema.String.pipe(Schema.brand("models/db/workspace-member_id"));

export enum WorkspaceMemberRole {
  Owner = "owner",
  Admin = "admin",
  Member = "member",
}

export class WorkspaceMember extends Schema.Class<WorkspaceMember, { readonly _: unique symbol }>(
  "models/db/workspace-member",
)({
  id: WorkspaceMemberId,
  role: Schema.Enum(WorkspaceMemberRole),
  userId: UserId,
  workspaceId: WorkspaceId,
  createdAt: Schema.DateTimeUtcFromDate,
}) {}
