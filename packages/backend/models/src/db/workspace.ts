import { WorkspaceMemberRow, WorkspaceRow } from "@crowdboard-backend/db-schema";
import { Schema, Types } from "effect";

import { UserId } from "./user";

export const WorkspaceId = Schema.String.pipe(Schema.brand("workspace"));

export const WorkspaceMemberId = Schema.String.pipe(Schema.brand("workspace-member"));

export const Workspace = Schema.Struct({
  id: WorkspaceId,
  name: Schema.String,
  slug: Schema.String,
  logo: Schema.String.pipe(Schema.OptionFromNullOr),
  metadata: Schema.String.pipe(Schema.OptionFromNullOr),
  createdAt: Schema.Date,
});

export const WorkspaceMember = Schema.Struct({
  id: WorkspaceMemberId,
  userId: UserId,
  workspaceId: WorkspaceId,
  role: Schema.String,
  createdAt: Schema.Date,
});

// verfy encoded type matches db row
type C0 = Types.Equals<typeof Workspace.Encoded, typeof WorkspaceRow.Type>;
const c0: C0 = true;
void c0;

type C1 = Types.Equals<typeof WorkspaceMember.Encoded, typeof WorkspaceMemberRow.Type>;
const c1: C1 = true;
void c1;
