import { Schema } from "effect";
import { HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";

export class SocialGroup extends HttpApiGroup.make("social").add(
  HttpApiEndpoint.get("connect", "/social/:provider", {
    params: { provider: Schema.String },
  }),
  HttpApiEndpoint.get("callback", "/social/:provider/cb", {
    params: { provider: Schema.String },
  }),
) {}
