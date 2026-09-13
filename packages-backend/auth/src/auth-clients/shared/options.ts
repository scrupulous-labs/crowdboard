import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2"
import { relations, schema } from "@crowdboard-backend/db"
import { Env } from "@crowdboard-backend/env"
import { type BetterAuthOptions } from "better-auth"
import { drizzle } from "drizzle-orm/node-postgres"
import { Effect, Redacted } from "effect"
import { Pool } from "pg"

type SharedOptionFields = "database" | "user" | "account" | "session" | "verification"

export const SharedOptions = Effect.gen(function* () {
  const env = yield* Env
  const pool = new Pool({ connectionString: Redacted.value(env.pg.url), max: 2 })
  const drizzleDb = drizzle({ client: pool, relations })
  const options: Pick<BetterAuthOptions, SharedOptionFields> = {
    database: drizzleAdapter(drizzleDb, { schema, provider: "pg", camelCase: true }),
    user: { modelName: "users", fields: { image: "avatarUrl" } },
    account: { modelName: "accounts" },
    session: { modelName: "userSessions" },
    verification: { modelName: "verifications" },
  }
  return options
}).pipe(Effect.provide(Env.layer), Effect.cached, Effect.runSync)
