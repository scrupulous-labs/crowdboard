import { Config, Redacted, Context, Effect, Layer } from "effect";

export class Env extends Context.Service<Env>()("@app/env", {
  make: Effect.gen(function* () {
    return yield* Config.all([
      Config.nested(
        Config.all([
          Config.string("HOST").pipe(Config.withDefault("localhost")),
          Config.number("PORT").pipe(Config.withDefault(5433)),
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
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
