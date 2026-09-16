import { writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

import { ConfigProviderForMigrationScript, Env } from "@crowdboard-backend/env"
import { Jobs } from "@crowdboard-backend/jobs"
import { Effect, Layer } from "effect"
import { getConstructionPlans, getMigrationPlans } from "pg-boss"

const InitializationMigration = Effect.gen(function* () {
  const env = yield* Env
  return getConstructionPlans(env.jobs.pgSchema)
})

const VersionUpgradeMigration = Effect.gen(function* () {
  const env = yield* Env
  const jobs = yield* Jobs
  const existingVersion = yield* jobs.schemaVersion
  return !!existingVersion
    ? getMigrationPlans(env.jobs.pgSchema, existingVersion)
    : undefined
})

const Migration = Effect.gen(function* () {
  const jobs = yield* Jobs
  const isInstalled = yield* jobs.isInstalled
  return yield* isInstalled ? VersionUpgradeMigration : InitializationMigration
}).pipe(
  Effect.provide(Layer.merge(Env.layer, Jobs.layer)),
  Effect.provide(ConfigProviderForMigrationScript.layer),
  Effect.runPromise,
)

try {
  const migration = await Migration
  if (!!migration) {
    const outputDir = join(import.meta.dirname, "../tmp")
    const outputFile = join(outputDir, "MIGRATION-JOBS.sql")
    mkdirSync(outputDir, { recursive: true })
    writeFileSync(outputFile, migration)
  }
} catch (err) {
  if (/Version \d+ not found/.test(String(err))) {
    console.info("Schema up to date. No migrations generated.")
  } else {
    console.error(JSON.stringify(err, null, 2))
  }
}
