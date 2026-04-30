import config from "../../config/index.js";

/**
 * Minimal logger abstraction.
 *
 * Swap the implementation (winston, pino, …) without touching call-sites.
 */
const isProd = config.app.nodeEnv === "production";

const ts = () => new Date().toISOString();

const fmt = (level, scope, msg, meta) => {
    const base = `[${ts()}] [${level}]${scope ? ` [${scope}]` : ""} ${msg}`;
    return meta ? `${base} ${typeof meta === "string" ? meta : JSON.stringify(meta)}` : base;
};

const make = (scope) => ({
    info: (msg, meta) => console.log(fmt("INFO", scope, msg, meta)),
    warn: (msg, meta) => console.warn(fmt("WARN", scope, msg, meta)),
    error: (msg, meta) => console.error(fmt("ERROR", scope, msg, meta)),
    debug: (msg, meta) => {
        if (!isProd) console.debug(fmt("DEBUG", scope, msg, meta));
    },
    child: (childScope) => make(scope ? `${scope}:${childScope}` : childScope),
});

const logger = make("");

export default logger;
