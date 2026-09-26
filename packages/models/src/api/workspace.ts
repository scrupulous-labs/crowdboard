import { Schema } from "effect"

export class RedirectToApp extends Schema.TaggedClass<RedirectToApp>()("RedirectToApp", {}) {}

export class RedirectToLogin extends Schema.TaggedClass<RedirectToLogin>()("RedirectToLogin", {}) {}

export class RedirectToUrl extends Schema.TaggedClass<RedirectToUrl>()("RedirectToUrl", {
  url: Schema.URLFromString,
}) {}

export class RedirectToOnboarding extends Schema.TaggedClass<RedirectToOnboarding>()(
  "RedirectToOnboarding",
  { step: Schema.Literals(["userDetails", "createWorkspace"]) },
) {}

// Errors
export class FormValidationError extends Schema.TaggedError<FormValidationError>()(
  "FormValidationError",
  {},
) {}
