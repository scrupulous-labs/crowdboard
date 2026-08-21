import { Schema } from "effect";

import { UserId } from "./user";

export const WorkspaceId = Schema.String.pipe(Schema.brand("workspace"));
export const Workspace = Schema.Struct({
  id: WorkspaceId,
  name: Schema.String,
  slug: Schema.String,
  logo: Schema.String.pipe(Schema.OptionFromNullOr),
  metadata: Schema.String.pipe(Schema.OptionFromNullOr),
  createdAt: Schema.Date,
});

export const WorkspaceMemberId = Schema.String.pipe(Schema.brand("workspace-member"));
export const WorkspaceMember = Schema.Struct({
  id: WorkspaceMemberId,
  userId: UserId,
  workspaceId: WorkspaceId,
  role: Schema.String,
  createdAt: Schema.Date,
});
