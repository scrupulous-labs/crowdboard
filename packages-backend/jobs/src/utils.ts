import { DbTransaction } from "@crowdboard-backend/db"
import { PgConnection } from "@effect/sql-pg"
import { SQL, sql } from "drizzle-orm"
import { Effect, identity } from "effect"

export function isMultiStatement(sql: string) {
  return sql.includes(";\n")
}

export function unwrapQueryResult(result: PgConnection.Result | PgConnection.Result[]) {
  return Array.isArray(result)
    ? ({ rows: result.flatMap((_) => _.rows) } as { rows: any[] })
    : ({ rows: result.rows } as { rows: any[] })
}

export function splitMultiStatement(stmt: string, values: unknown[]) {
  const regex = /\$(\d+)/g
  // Check if pg-boss provided a well formed query
  if ([...stmt.matchAll(regex)].length !== values.length) {
    process.exit(1)
  }
  // Re-number $N, $N+1, ... -> $1, $2, ... local to each statement
  // and assign corresponding values from the values array
  return stmt.split(";\n").map((sql) => {
    const posParams = [...sql.matchAll(regex)].map((match) => +match[1])
    return {
      sql: sql.replace(regex, (_, posParam) => `$${posParams.indexOf(+posParam) + 1}`),
      values: posParams.map((posParam) => values[posParam - 1]),
    } as const
  })
}

export function fromDrizzle(tx: DbTransaction) {
  // Drizzle only support templated queries
  const toDrizzleQuery = (query: string, values: unknown[]) => {
    const isEven = (n: number) => n % 2 === 0
    return sql.join(
      query.split(/\$(\d+)/).reduce((chunks, part, ind) => {
        return [...chunks, isEven(ind) ? sql.raw(part) : sql`${sql.param(values[+part - 1])}`]
      }, [] as SQL[]),
    )
  }
  return {
    executeSql: (sql: string, values: unknown[] = []) =>
      Effect.forEach(splitMultiStatement(sql, values), (stmt) =>
        tx.execute(toDrizzleQuery(stmt.sql, stmt.values), "objects"),
      ).pipe(
        Effect.map((rows) => ({ rows: rows.flatMap(identity) }) as { rows: any[] }),
        Effect.runPromise,
      ),
  }
}
