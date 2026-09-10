import { Data } from "effect"

export class DbMigrationError extends Data.TaggedError("DbMigrationError")<{
  readonly cause: unknown
}> {}
