import { Schema } from "effect"

import { UserId } from "./user"
import { WorkspaceId } from "./workspace"

export type WorkspaceMemberId = typeof WorkspaceMemberId.Type
export const WorkspaceMemberId = Schema.String.pipe(Schema.brand("WorkspaceMemberId"))

export enum WorkspaceMemberRole {
  Owner = "owner",
  Admin = "admin",
  Member = "member",
}

export class WorkspaceMember extends Schema.Class<WorkspaceMember>("WorkspaceMember")({
  id: WorkspaceMemberId,
  role: Schema.Enum(WorkspaceMemberRole),
  userId: UserId,
  workspaceId: WorkspaceId,
  createdAt: Schema.DateTimeUtcFromDate,
}) {}
