import { Env } from "@crowdboard-backend/env"
import { PgPool } from "@effect/sql-pg"
import { Context, Effect, Fiber, Layer, Queue, Schedule } from "effect"
import { PgBoss } from "pg-boss"

export class Jobs extends Context.Service<Jobs>()("@services/jobs", {
  make: Effect.gen(function* () {
    const pool = yield* PgPool.PgPool
    const jobs = new PgBoss({
      schema: "jobs",
      useListenNotify: true,
      db: {
        executeSql: (sql, values) =>
          Effect.gen(function* () {
            const connection = yield* pool.get
            const result = yield* connection.query(sql, values)
            return result as unknown as { rows: any[] }
          }).pipe(Effect.scoped, Effect.runPromise),

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

    return jobs
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
