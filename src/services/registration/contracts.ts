export type RegistrationSuccess = {
  ok: true;
  requiresEmailVerification: true;
};

export type RegistrationFailure = {
  ok: false;
  code: "VALIDATION_ERROR" | "REGISTRATION_CONFLICT" | "SERVICE_UNAVAILABLE";
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId?: string;
};

export type LoginFailure = {
  ok: false;
  code: "VALIDATION_ERROR" | "INVALID_CREDENTIALS" | "SERVICE_UNAVAILABLE";
  message: string;
  fieldErrors?: Record<string, string[]>;
};
