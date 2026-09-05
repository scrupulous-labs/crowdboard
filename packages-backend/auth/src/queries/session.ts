import { Effect, Schema } from "effect";

import { type WidgetAuthClient } from "../auth-clients/widget-auth-client";
import { type WorkspaceAuthClient } from "../auth-clients/workspace-auth-client";

type AuthClient = WorkspaceAuthClient | WidgetAuthClient;

export const makeGetSession = (c: AuthClient) =>
  Effect.fn("getSession")(function* (headers: Headers) {
    const res = yield* Effect.promise(async () => c.api.getSession({ headers }));
    return Schema.decodeUnknownSync(Schema.OptionFromNullishOr(Schema.Struct({ session: Schema.String })))(
      res,
    );
  });
