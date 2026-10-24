import { Schema } from "effect"

import { TeamId } from "./team"
import { UserId } from "./user"

export type TeamMemberId = typeof TeamMemberId.Type
export const TeamMemberId = Schema.String.pipe(Schema.brand("TeamMemberId"))

export class TeamMember extends Schema.Class<TeamMember>("TeamMember")({
  id: TeamMemberId,
  userId: UserId,
  teamId: TeamId,
  membershipKey: Schema.String,
  createdAt: Schema.DateTimeUtcFromDate,
}) {}
