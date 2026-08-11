import { Config, Redacted, Effect } from "effect";

export class ServerConfig extends Effect.Service<ServerConfig>()("@app/server-config", {
  effect: Effect.gen(function* () {
    const config = yield* Config.all([
      Config.nested(
        Config.all([
          Config.string("HOST").pipe(Config.withDefault("localhost")),
          Config.integer("PORT").pipe(Config.withDefault(5433)),
          Config.string("USER").pipe(Config.withDefault("postgres")),
          Config.string("PASSWORD").pipe(Config.withDefault("postgres")),
          Config.string("DATABASE").pipe(Config.withDefault("crowdboard")),
        ]),
        "PG",
      ),
    ]).pipe(
      Config.map(([[pgHost, pgPort, pgUser, pgPassword, pgDatabase]]) => ({
        pgUrl: Redacted.make(`postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`),
      })),
    );

    return config;
  }),
}) {}
