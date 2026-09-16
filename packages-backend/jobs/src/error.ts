import { Schema } from "effect"

export class JobsError extends Schema.TaggedError<JobsError>("@errors/jobs")("JobsError", {
  cause: Schema.Defect(),
  operation: Schema.Literals(["start", "isInstalled", "schemaVersion"]),
}) {}
