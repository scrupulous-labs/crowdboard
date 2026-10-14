import * as HttpApiSchema from "effect/http-api/HttpApiSchema"
import * as Schema from "effect/Schema"

export * from "effect/http-api/HttpApiSchema"

export function headers<H extends Schema.Struct.Fields>(
  headers: H,
): <S extends Schema.Top>(schema: S) => HttpApiSchema.WithHeaders<S, Schema.Struct<H>>

export function headers<H extends Schema.Top>(
  headers: H,
): <S extends Schema.Top>(schema: S) => HttpApiSchema.WithHeaders<S, H>

export function headers(headers: Schema.Top) {
  return function (schema: Schema.Top) {
    return HttpApiSchema.WithHeaders(schema, headers)
  }
}
