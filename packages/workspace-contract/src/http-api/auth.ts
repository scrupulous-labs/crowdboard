import { Schema } from "effect";
import { HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";

export class AuthGroup extends HttpApiGroup.make("auth").add(
  HttpApiEndpoint.post("signUp", "/signUp", {}),
  HttpApiEndpoint.get("connectSocial", "/auth/:provider", {
    params: { provider: Schema.Literal("google") },
  }),
  HttpApiEndpoint.get("socialCallback", "/auth/:provider/callback", {
    params: { provider: Schema.Literal("google") },
    query: Schema.Record(Schema.String, Schema.String),
  }),
) {}
