import { writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

import { getMigrationPlans } from "pg-boss"

const sql = getMigrationPlans("jobs", 40)
const outputDir = join(import.meta.dirname, "../tmp")
const outputFile = join(outputDir, "QUEUE-MIGRATION.sql")

mkdirSync(outputDir, { recursive: true })
writeFileSync(outputFile, sql)
