import config from "../../config/index.js";
import MongoAdapter from "./mongo.adapter.js";
import PostgresAdapter from "./postgres.adapter.js";

const adapters = {
    mongo: MongoAdapter,
    postgres: PostgresAdapter,
};

const Adapter = adapters[config.db.driver];
if (!Adapter) {
    throw new Error(`Unknown db.driver: "${config.db.driver}"`);
}

/**
 * Singleton DB adapter — repositories import this directly.
 * Swap by changing `config.db.driver`.
 */
export const db = new Adapter();

export const connectDatabase = () => db.connect(config.db.uri);
