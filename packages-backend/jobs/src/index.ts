import { Env } from "@crowdboard-backend/env"
import { PgPool } from "@effect/sql-pg"
import { Context, Effect, Fiber, Layer, Queue, Schedule } from "effect"
import { PgBoss } from "pg-boss"

import { JobsError } from "./error"

export class Jobs extends Context.Service<Jobs>()("@services/jobs", {
  make: Effect.gen(function* () {
    const pool = yield* PgPool.PgPool
    const jobs = new PgBoss({
      schema: "jobs",
      migrate: false,
      createSchema: false,
      useListenNotify: true,
      db: {
        executeSql: (sql, values = []) =>
          (!isMultiStatement(sql)
            ? Effect.gen(function* () {
                const connection = yield* pool.get
                const result = yield* connection.query(sql, values)
                return result as unknown as { rows: any[] }
              })
            : Effect.gen(function* () {
                const connection = yield* pool.reserve
                const result = yield* Effect.forEach(splitMultiStatment(sql, values), ([sql, values]) =>
                  connection.query(sql, values),
                )
                return result as unknown as { rows: any[] }
              })
          ).pipe(Effect.scoped, Effect.runPromise),

        listen: (channel, onNotification, onReconnect) =>
          Effect.gen(function* () {
            const listener = Effect.gen(function* () {
              onReconnect()
              const connection = yield* pool.reserve
              const notificationQueue = yield* connection.listen(channel)
              while (true) {
                const notification = yield* Queue.take(notificationQueue)
                onNotification(notification.payload)
              }
            }).pipe(
              Effect.scoped,
              Effect.retry({
                times: 10,
                while: (error) => error.isRetryable,
                schedule: Schedule.exponential("500 millis", 2),
              }),
            )

            const listenerFiber = yield* listener.pipe(Effect.forkDetach)
            return { close: () => Fiber.interrupt(listenerFiber).pipe(Effect.runPromise) }
          }).pipe(Effect.runPromise),
      },
    })

    return {
      start: Effect.tryPromise({
        try: () => jobs.start(),
        catch: (cause) => new JobsError({ cause, operation: "start" }),
      }),
      isInstalled: Effect.tryPromise({
        try: () => jobs.isInstalled(),
        catch: (cause) => new JobsError({ cause, operation: "isInstalled" }),
      }),
      schemaVersion: Effect.tryPromise({
        try: () => jobs.schemaVersion(),
        catch: (cause) => new JobsError({ cause, operation: "schemaVersion" }),
      }),
    }
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(
      Env.pipe(
        Effect.map(({ pg: { url, maxConnections } }) => {
          const config: PgPool.Config = { url, maxConnections: maxConnections.jobs, multiplex: true }
          return Layer.effect(PgPool.PgPool, PgPool.make(config))
        }),
        Layer.unwrap,
        Layer.provide(Env.layer),
      ),
    ),
  )
}

// Utils
function isMultiStatement(sql: string) {
  return sql.includes(";")
}

function splitMultiStatment(multi: string, values: unknown[]) {
  if ([...multi.matchAll(/\$(\d+)/g)].length !== values.length) {
    process.exit(1)
  }

  // renumber $N, $N+1, ... -> $1, $2, ... local to each statement and provide corresponding values
  return multi.split(";\n").map((sql) => {
    const placeholders = [...sql.matchAll(/\$(\d+)/g)].map((match) => Number(match[1]))
    return [
      sql.replace(/\$(\d+)/g, (_, placeholder) => `$${placeholders.indexOf(+placeholder) + 1}`),
      placeholders.map((placeholder) => values[placeholder - 1]),
    ] as const
  })
}
