import { Env } from "@crowdboard-backend/env";
import { betterAuth } from "better-auth";
import { Cause, Effect, Exit, Redacted } from "effect";
import { Pool } from "pg";

const pgUrl = Effect.runSyncExit(Env.make).pipe(
  Exit.match({
    onFailure: (cause) => {
      console.log(Cause.pretty(cause));
      process.exit(1);
    },
    onSuccess: (result) => {
      const url = Redacted.value(result.pgUrl);
      return url;
    },
  }),
);

export const auth = betterAuth({
  database: new Pool({
    connectionString: pgUrl,
  }),
});
