import { Auth } from "@crowdboard-backend/auth";
import { Cause, Effect, Exit, identity } from "effect";

export const auth = await Auth.pipe(
  Effect.provide(Auth.layerForMigrationScripts),
  Effect.runPromiseExit,
).then(
  Exit.match({
    onSuccess: identity,
    onFailure: (cause) => {
      console.log(Cause.pretty(cause));
      process.exit(1);
    },
  }),
);
