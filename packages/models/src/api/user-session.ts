import { pipe, Schema } from "effect"

import { TeamId } from "../model/db/team"
import { UserId } from "../model/db/user"
import { WorkspaceId } from "../model/db/workspace"
import { Email } from "../utils"

export type UserSessionId = typeof UserSessionId.Type
export const UserSessionId = Schema.String.pipe(Schema.brand("UserSessionId"))

export class UserSession extends Schema.Class<UserSession>("UserSession")({
  id: UserSessionId,
  userId: UserId,
  activeTeamId: TeamId.pipe(Schema.OptionFromNullishOr),
  activeWorkspaceId: WorkspaceId.pipe(Schema.OptionFromNullishOr),
  name: Schema.String,
  email: Email,
  emailVerified: Schema.Boolean,
  avatarUrl: Schema.URLFromString.pipe(Schema.OptionFromNullishOr),
}) {}

export const decodeFromAuth = pipe(
  UserSession,
  Schema.encodeKeys({ activeWorkspaceId: "activeOrganizationId", avatarUrl: "image" }),
  Schema.OptionFromNullishOr,
  Schema.decodeUnknownSync,
)
