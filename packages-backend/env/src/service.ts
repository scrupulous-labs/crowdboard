import { Config, Context, Layer, Redacted } from "effect";

const toHref = (url: URL) => url.href;

export class Env extends Context.Service<Env>()("@app/env", {
  make: Config.all([
    Config.nested(
      Config.all([
        Config.url("WORKSPACE_ORIGIN").pipe(Config.map(toHref)),
        Config.nonEmptyString("ROOT_DOMAIN"),
      ]),
      "APP",
    ),
    Config.nested(
      Config.all([
        Config.int("PORT"),
        Config.url("ORIGIN").pipe(Config.map(toHref)),
        Config.url("ORIGIN_LOCALHOST").pipe(Config.map(toHref)),
      ]),
      "SERVER",
    ),
    Config.nested(
      Config.all([
        Config.nested(
          Config.all([
            Config.nonEmptyString("CLIENT_ID"),
            Config.nonEmptyString("CLIENT_SECRET"),
            Config.url("REDIRECT_URI").pipe(Config.map(toHref)),
          ]),
          "GOOGLE",
        ),
      ]),
      "AUTH",
    ),
    Config.nested(
      Config.all([
        Config.int("PORT"),
        Config.nonEmptyString("HOST"),
        Config.nonEmptyString("USER"),
        Config.nonEmptyString("PASSWORD"),
        Config.nonEmptyString("DATABASE"),
        Config.boolean("MIGRATIONS_ENABLED"),
      ]),
      "PG",
    ),
  ]).pipe(
    Config.map(
      ([
        [appWorkspaceOrigin, appRootDomain],
        [serverPort, serverOrigin, serverOriginLocalhost],
        [[googleClientId, googleClientSecret, googleRedirectUri]],
        [pgPort, pgHost, pgUser, pgPassword, pgDatabase, pgMigrationsEnabled],
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
          url: Redacted.make(`postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`),
          migrationsEnabled: pgMigrationsEnabled,
        },
      }),
    ),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
