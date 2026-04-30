import { db } from "./index.js";

/**
 * Base repository — generic CRUD via the active DB adapter.
 *
 * Feature repositories should extend this and add domain-specific
 * methods (e.g. `findByEmail`, `searchByTitle`).
 */
export default class BaseRepository {
    constructor(model) {
        this.model = model;
        this.db = db;
    }

    create(data, options) { return this.db.create(this.model, data, options); }
    findById(id, options) { return this.db.findById(this.model, id, options); }
    findOne(filter, options) { return this.db.findOne(this.model, filter, options); }
    find(filter, options) { return this.db.find(this.model, filter, options); }
    updateById(id, data, options) { return this.db.updateById(this.model, id, data, options); }
    updateOne(filter, data, options) { return this.db.updateOne(this.model, filter, data, options); }
    deleteById(id) { return this.db.deleteById(this.model, id); }
    count(filter) { return this.db.count(this.model, filter); }
    exists(filter) { return this.db.exists(this.model, filter); }
    aggregate(pipeline) { return this.db.aggregate(this.model, pipeline); }
}
