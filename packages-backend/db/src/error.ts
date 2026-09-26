import { Schema } from "effect"

export class DbMigrationError extends Schema.TaggedError<DbMigrationError>("@errors/db/migration")(
  "DbMigrationError",
  {
    cause: Schema.Defect(),
    operation: Schema.Literals(["RUN-MIGRATIONS", "CONNECT-DB"]),
  },
) {}
