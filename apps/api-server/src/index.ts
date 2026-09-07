import { WorkspaceAuth } from "@crowdboard-backend/auth";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  const auth = yield* WorkspaceAuth;
  const value = yield* Effect.promise(async () => {
    return auth.client.api.signInSocial({
      body: { provider: "google" },
    });
  });
  yield* Effect.log(value);
}).pipe(Effect.provide(WorkspaceAuth.layer), Effect.catch(Effect.logError));

void Effect.runPromise(program);
