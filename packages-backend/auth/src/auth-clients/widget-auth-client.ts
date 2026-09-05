import { Env } from "@crowdboard-backend/env";
import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { Effect } from "effect";

import { organization, SharedOptions } from "./shared";

const _WidgetAuthClient = Effect.gen(function* () {
  const env = yield* Env;
  const sharedOptions = yield* SharedOptions;

  return betterAuth({
    baseURL: env.server.origin,
    trustedOrigins: ["*"],
    advanced: { database: { joins: true, generateId: createId } },
    plugins: [bearer(), organization],
    ...sharedOptions,
  });
});

export interface WidgetAuthClient extends Effect.Success<typeof _WidgetAuthClient> {}
export const WidgetAuthClient: Effect.Effect<
  WidgetAuthClient,
  Effect.Error<typeof _WidgetAuthClient>,
  Effect.Services<typeof _WidgetAuthClient>
> = _WidgetAuthClient;
