import DBInterface from "./db.interface.js";

/**
 * PostgresAdapter — placeholder.
 *
 * Plug in `pg`, Drizzle, Prisma, Knex, etc. in a future iteration.
 * Throws clearly so misconfiguration surfaces immediately.
 */
export default class PostgresAdapter extends DBInterface {
    async connect() {
        throw new Error("PostgresAdapter not implemented yet — install pg/drizzle and implement methods.");
    }
}
