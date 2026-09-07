import { Env } from "@crowdboard-backend/env";
import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { anonymous, bearer } from "better-auth/plugins";
import { Effect } from "effect";

import { organization, SharedOptions } from "./shared";

const Client = Effect.gen(function* () {
  const env = yield* Env;
  const sharedOptions = yield* SharedOptions;

  return betterAuth({
    baseURL: env.server.origin,
    trustedOrigins: ["*"],
    advanced: { database: { joins: true, generateId: createId } },
    plugins: [bearer(), anonymous(), organization],
    ...sharedOptions,
  });
});

export interface WidgetAuthClient extends Effect.Success<typeof Client> {}
export const WidgetAuthClient: Effect.Effect<
  WidgetAuthClient,
  Effect.Error<typeof Client>,
  Effect.Services<typeof Client>
> = Client;
