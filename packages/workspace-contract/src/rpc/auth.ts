import { Context, Effect, Layer, Schema } from "effect";
import { Rpc, RpcGroup, RpcMiddleware } from "effect/unstable/rpc";

export class AuthGroup extends RpcGroup.make(
  Rpc.make("SignUp", {
    payload: {
      email: Schema.NonEmptyString,
      password: Schema.NonEmptyString,
    },
  }),
  Rpc.make("LogIn", {
    payload: {
      email: Schema.NonEmptyString,
      password: Schema.NonEmptyString,
    },
  }),
  Rpc.make("LogOut", {}),
) {}

export class Session extends Context.Service<Session, { loggedIn: boolean }>()("session") {}

export class SessionMiddleware extends RpcMiddleware.Service<SessionMiddleware, { provides: Session }>()(
  "session-middleware",
) {
  static readonly layer = Layer.succeed(
    SessionMiddleware,
    SessionMiddleware.of((next, { headers }) => Effect.succeed({ loggedIn: headers.has("authorization") })),
  );
}
