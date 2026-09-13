import { writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

import { getMigrationPlans } from "pg-boss"

const schemaName = "jobs"
const existingVersion = 40
try {
  const sql = getMigrationPlans(schemaName, existingVersion)
  const outputDir = join(import.meta.dirname, "../tmp")
  const outputFile = join(outputDir, "MIGRATION-JOBS.sql")

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputFile, sql)
} catch (err) {
  if (String(err).includes(`Version ${existingVersion} not found`)) {
    console.info("Schema up to date. No migrations generated.")
  } else {
    console.error(err)
  }
}
