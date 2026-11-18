export const SESSION_COOKIE_NAME = "admin-session";

// Firebase caps session cookies at 14 days. The browser renews this cookie
// periodically, but the original Firebase sign-in is capped at 30 days.
export const FIREBASE_SESSION_COOKIE_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
export const ADMIN_SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
export const SESSION_ID_TOKEN_MAX_AGE_MS = 10 * 60 * 1000;
export const SESSION_RENEWAL_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSION_RENEWAL_CHECK_INTERVAL_MS = 12 * 60 * 60 * 1000;
