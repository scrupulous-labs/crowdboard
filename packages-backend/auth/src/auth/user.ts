import { Effect, Schema } from "effect"

import { type WidgetAuthClient } from "../auth-clients/widget-auth-client"
import { type WorkspaceAuthClient } from "../auth-clients/workspace-auth-client"
import { toAuthError } from "./error"

export const makeGetSession = (c: WorkspaceAuthClient | WidgetAuthClient) =>
  Effect.fn("@auth/getSession")(function* (headers: Headers) {
    const schema = Schema.Struct({ userId: Schema.String })
    const session = yield* Effect.tryPromise({
      try: () => c.api.getSession({ headers }),
      catch: toAuthError,
    }).pipe(
      Effect.map((res) => res && { ...res.session, ...res.user }),
      Effect.andThen(Schema.decodeEffect(Schema.OptionFromNullishOr(schema))),
    )
    return session
  })

export const makeCreateEmailAccount = (c: WorkspaceAuthClient) =>
  Effect.fn("@auth/createEmailAccount")(function* () {})
