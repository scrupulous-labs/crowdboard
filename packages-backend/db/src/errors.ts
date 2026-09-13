import { Schema } from "effect"

export class DbMigrationError extends Schema.TaggedError<DbMigrationError>("@app/errors/db/migration")(
  "DbMigrationError",
  {
    cause: Schema.Defect(),
    operation: Schema.Literals(["RUN-MIGRATIONS", "CONNECT-DB"]),
  },
) {}
