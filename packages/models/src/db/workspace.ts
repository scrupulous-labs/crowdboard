import { Schema } from "effect";

export type WorkspaceId = typeof WorkspaceId.Type;
export const WorkspaceId = Schema.String.pipe(Schema.brand("models/db/workspace_id"));

export class Workspace extends Schema.Class<Workspace, { readonly brand: unique symbol }>(
  "models/db/workspace",
)({
  id: WorkspaceId,
  name: Schema.String,
  slug: Schema.String,
  logo: Schema.String.pipe(Schema.OptionFromNullOr),
  metadata: Schema.String.pipe(Schema.OptionFromNullOr),
  createdAt: Schema.DateTimeUtcFromDate,
}) {}
