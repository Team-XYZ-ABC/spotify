import config from "../config/index.js";

/**
 * Cookie options for setting/clearing the auth token cookie.
 * Centralised so cookie behaviour stays consistent everywhere.
 */
export const authCookieOptions = () => ({
    httpOnly: true,
    secure: config.app.nodeEnv === "production",
    sameSite: "strict",
    maxAge: config.auth.cookieMaxAgeMs,
});

export const authCookieClearOptions = () => ({
    httpOnly: true,
    secure: config.app.nodeEnv === "production",
    sameSite: "strict",
});
