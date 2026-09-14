import { Config, Context, Layer, Redacted } from "effect"

export * as MigrationScriptConfigProvider from "./config-providers/migration-script"

export class Env extends Context.Service<Env>()("@app/env", {
  make: Config.all([
    Config.nested(
      Config.all([
        Config.URL("WORKSPACE_ORIGIN").pipe(Config.map(toHref)),
        Config.NonEmptyString("ROOT_DOMAIN"),
      ]),
      "APP",
    ),
    Config.nested(
      Config.all([
        Config.Port("PORT"),
        Config.URL("ORIGIN").pipe(Config.map(toHref)),
        Config.URL("ORIGIN_LOCALHOST").pipe(Config.map(toHref)),
      ]),
      "SERVER",
    ),
    Config.nested(
      Config.all([
        Config.nested(
          Config.all([
            Config.NonEmptyString("CLIENT_ID"),
            Config.NonEmptyString("CLIENT_SECRET"),
            Config.URL("REDIRECT_URI").pipe(Config.map(toHref)),
          ]),
          "GOOGLE",
        ),
      ]),
      "AUTH",
    ),
    Config.nested(
      Config.all([
        Config.Port("PORT"),
        Config.NonEmptyString("HOST"),
        Config.NonEmptyString("USER"),
        Config.NonEmptyString("PASSWORD"),
        Config.NonEmptyString("DATABASE"),
        Config.Boolean("MIGRATIONS_ENABLED"),
        Config.nested(
          Config.all([Config.Int("DB"), Config.Int("JOBS"), Config.Int("AUTH")]),
          "MAX_CONNECTIONS",
        ),
      ]),
      "PG",
    ),
  ]).pipe(
    Config.map(
      ([
        [appWorkspaceOrigin, appRootDomain],
        [serverPort, serverOrigin, serverOriginLocalhost],
        [[googleClientId, googleClientSecret, googleRedirectUri]],
        [
          pgPort,
          pgHost,
          pgUser,
          pgPassword,
          pgDb,
          pgMigrationsEnabled,
          [pgMaxConnDb, pgMaxConnJobs, pgMaxConnAuth],
        ],
      ]) => ({
        app: {
          rootDomain: appRootDomain,
          workspaceOrigin: appWorkspaceOrigin,
        },
        server: {
          port: serverPort,
          origin: serverOrigin,
          originLocalhost: serverOriginLocalhost,
        },
        auth: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            redirectUri: googleRedirectUri,
          },
        },
        pg: {
          url: Redacted.make(`postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDb}`),
          maxConnections: { db: pgMaxConnDb, jobs: pgMaxConnJobs, auth: pgMaxConnAuth },
          migrationsEnabled: pgMigrationsEnabled,
        },
      }),
    ),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make)
}

// Utils
function toHref(URL: URL) {
  return URL.href
}
