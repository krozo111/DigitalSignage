export function errorMessage(err: unknown, fallback = "Unexpected error"): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}
