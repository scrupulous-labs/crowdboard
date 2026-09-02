import { Config, Redacted, Context, Layer } from "effect";

export class Env extends Context.Service<Env>()("@app/env", {
  make: Config.all([
    Config.int("PORT"),
    Config.literals(["production", "development"], "NODE_ENV"),
    Config.nested(
      Config.all([Config.nonEmptyString("CLIENT_ID"), Config.nonEmptyString("CLIENT_SECRET")]),
      "AUTH_GOOGLE",
    ),
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
  ]).pipe(
    Config.map(
      ([
        port,
        nodeEnv,
        [googleClientId, googleClientSecret],
        [pgHost, pgPort, pgUser, pgPassword, pgDatabase, pgAutoMigrate],
      ]) => ({
        port,
        nodeEnv,
        google: { clientId: googleClientId, clientSecret: googleClientSecret },
        pg: {
          url: Redacted.make(`postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`),
          autoMigrate: pgAutoMigrate,
        },
      }),
    ),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make);

  static readonly layerForMigrationScripts = Layer.succeed(
    this,
    this.of({
      port: 0,
      nodeEnv: "development",
      google: { clientId: "", clientSecret: "" },
      pg: {
        url: Redacted.make("postgresql://postgres:postgres@localhost:5433/crowdboard"),
        autoMigrate: false,
      },
    }),
  );
}
