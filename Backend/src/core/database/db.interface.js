/* eslint-disable no-unused-vars */

/**
 * Database abstraction contract.
 *
 * Every adapter (Mongo, Postgres, …) MUST implement this surface so
 * repositories can stay DB-agnostic. Repositories pass a "Model" handle
 * that the adapter understands (Mongoose model for MongoAdapter, table
 * name for PostgresAdapter, etc.).
 */
export default class DBInterface {
    // ── Lifecycle ────────────────────────────────────────────
    async connect(uri) { throw new Error("connect() not implemented"); }
    async disconnect() { throw new Error("disconnect() not implemented"); }
    async startSession() { throw new Error("startSession() not implemented"); }

    // ── CRUD ─────────────────────────────────────────────────
    async create(Model, data, options = {}) { throw new Error("create() not implemented"); }
    async findById(Model, id, options = {}) { throw new Error("findById() not implemented"); }
    async findOne(Model, filter, options = {}) { throw new Error("findOne() not implemented"); }
    async find(Model, filter = {}, options = {}) { throw new Error("find() not implemented"); }
    async updateById(Model, id, data, options = {}) { throw new Error("updateById() not implemented"); }
    async updateOne(Model, filter, data, options = {}) { throw new Error("updateOne() not implemented"); }
    async deleteById(Model, id) { throw new Error("deleteById() not implemented"); }
    async count(Model, filter = {}) { throw new Error("count() not implemented"); }
    async exists(Model, filter) { throw new Error("exists() not implemented"); }
    async aggregate(Model, pipeline) { throw new Error("aggregate() not implemented"); }

    // Optional escape hatch when an adapter exposes raw query helpers
    raw() { throw new Error("raw() not implemented"); }
}
