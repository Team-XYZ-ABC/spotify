import config from "../config.js";

const isProduction = config.nodeEnv === "production" || process.env.RENDER === "true";

export const authCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: config.auth.cookieMaxAgeMs,
});

export const authCookieClearOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
});
