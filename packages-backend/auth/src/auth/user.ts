import { Effect, Schema } from "effect"

import { Auth } from "../service"
import { toAuthError } from "./utils"

const schema = Schema.Struct({ userId: Schema.String })

export const getSession = Effect.fn("auth.getSession")(function* (headers: Headers) {
  const auth = yield* Auth
  const session = yield* Effect.tryPromise({
    try: () => auth.api.getSession({ headers }),
    catch: toAuthError,
  }).pipe(
    Effect.map((res) => res && { ...res.session, ...res.user }),
    Effect.andThen(Schema.decodeEffect(Schema.OptionFromNullishOr(schema))),
  )
  return session
})
