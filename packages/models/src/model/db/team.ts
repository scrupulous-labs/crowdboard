import { Schema } from "effect"

import { WorkspaceId } from "./workspace"

export type TeamId = typeof TeamId.Type
export const TeamId = Schema.String.pipe(Schema.brand("TeamId"))

export class Team extends Schema.Class<Team>("Team")({
  id: TeamId,
  workspaceId: WorkspaceId,
  name: Schema.String,
  memberCount: Schema.Int,
  createdAt: Schema.DateTimeUtcFromDate,
  updatedAt: Schema.DateTimeUtcFromDate,
}) {}
