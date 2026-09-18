import { pipe, Schema } from "effect"

import { TeamId } from "../model/db/team"
import { UserId } from "../model/db/user"
import { WorkspaceId } from "../model/db/workspace"

export type SessionId = typeof SessionId.Type
export const SessionId = Schema.String.pipe(Schema.brand("SessionId"))

export class Session extends Schema.Class<Session>("Session")(
  Schema.Struct({
    id: SessionId,
    userId: UserId,
    activeWorkspaceId: WorkspaceId.pipe(Schema.OptionFromNullishOr),
    activeTeamId: TeamId.pipe(Schema.OptionFromNullishOr),
  }),
) {
  static readonly decodeFromAuth = pipe(
    this,
    Schema.encodeKeys({ activeWorkspaceId: "activeOrganizationId" }),
    Schema.OptionFromNullishOr,
    Schema.decodeUnknownEffect,
  )
}
