import { Schema } from "effect";
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

export class SessionMiddleware extends RpcMiddleware.Service<SessionMiddleware, {}>()("session-middleware") {}
