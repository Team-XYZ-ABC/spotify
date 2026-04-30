import config from "../config.js";

export const authCookieOptions = () => ({
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: config.auth.cookieMaxAgeMs,
});

export const authCookieClearOptions = () => ({
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
});
