import { Config, Redacted, Context, Layer } from "effect";

export class Env extends Context.Service<Env>()("@app/env", {
  make: Config.all([Config.literals(["production", "development"], "NODE_ENV")]).pipe(
    Config.map(([nodeEnv]) => ({ nodeEnv })),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make);
}

export class ServerEnv extends Context.Service<ServerEnv>()("@app/server-env", {
  make: Config.nested(
    Config.all([
      Config.int("PORT"),
      Config.url("ORIGIN").pipe(Config.map((url) => url.href)),
      Config.url("ORIGIN_LOCALHOST").pipe(Config.map((url) => url.href)),
    ]),
    "SERVER",
  ).pipe(
    Config.map(([serverPort, serverOrigin, serverOriginLocalhost]) => ({
      port: serverPort,
      origin: serverOrigin,
      originLocalhost: serverOriginLocalhost,
    })),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make);
}

export class AuthEnv extends Context.Service<AuthEnv>()("@app/auth-env", {
  make: Config.nested(
    Config.all([
      Config.nested(
        Config.all([
          Config.nonEmptyString("CLIENT_ID"),
          Config.nonEmptyString("CLIENT_SECRET"),
          Config.url("REDIRECT_URI").pipe(Config.map((url) => url.href)),
        ]),
        "GOOGLE",
      ),
    ]),
    "AUTH",
  ).pipe(
    Config.map(([[googleClientId, googleClientSecret, googleRedirectUri]]) => ({
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        redirectUri: googleRedirectUri,
      },
    })),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make);
}

export class PgEnv extends Context.Service<PgEnv>()("@app/pg-env", {
  make: Config.nested(
    Config.all([
      Config.int("PORT"),
      Config.nonEmptyString("HOST"),
      Config.nonEmptyString("USER"),
      Config.nonEmptyString("PASSWORD"),
      Config.nonEmptyString("DATABASE"),
      Config.boolean("MIGRATIONS_ENABLED"),
    ]),
    "PG",
  ).pipe(
    Config.map(([pgPort, pgHost, pgUser, pgPassword, pgDatabase, pgMigrationsEnabled]) => ({
      url: Redacted.make(`postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`),
      migrationsEnabled: pgMigrationsEnabled,
    })),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make);
  static readonly layerForMigrationScripts = Layer.succeed(
    this,
    this.of({
      url: Redacted.make("postgresql://postgres:postgres@localhost:5433/crowdboard"),
      migrationsEnabled: true,
    }),
  );
}
