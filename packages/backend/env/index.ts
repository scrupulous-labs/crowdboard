import { Config, Redacted, Context, Layer } from "effect";

export class Env extends Context.Service<Env>()("@app/env", {
  make: Config.all([
    Config.nested(
      Config.all([
        Config.nonEmptyString("HOST"),
        Config.int("PORT"),
        Config.nonEmptyString("USER"),
        Config.nonEmptyString("PASSWORD"),
        Config.nonEmptyString("DATABASE"),
        Config.boolean("AUTO_MIGRATION_ENABLED"),
      ]),
      "PG",
    ),
    Config.nonEmptyString("HOSTNAME"),
  ]).pipe(
    Config.map(([[pgHost, pgPort, pgUser, pgPassword, pgDatabase, pgAutoMigrate], hostname]) => ({
      pgUrl: Redacted.make(`postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`),
      pgAutoMigrate,
      hostname,
    })),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make);

  static readonly layerForMigrationScripts = Layer.succeed(
    this,
    this.of({
      pgUrl: Redacted.make("postgresql://postgres:postgres@$localhost:5433/crowdboard"),

      // these are immaterial for db migration scripts
      pgAutoMigrate: false,
      hostname: "",
    }),
  );
}
