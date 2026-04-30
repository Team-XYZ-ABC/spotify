import mongoose from "mongoose";
import DBInterface from "./db.interface.js";
import logger from "../logger/logger.js";

const log = logger.child("mongo");

/**
 * Apply optional Mongoose query modifiers to a Query chain.
 */
const applyOpts = (q, { select, populate, sort, skip, limit, lean, session } = {}) => {
    if (select) q = q.select(select);
    if (populate) q = q.populate(populate);
    if (sort) q = q.sort(sort);
    if (skip) q = q.skip(skip);
    if (limit) q = q.limit(limit);
    if (lean) q = q.lean();
    if (session) q = q.session(session);
    return q;
};

export default class MongoAdapter extends DBInterface {
    async connect(uri) {
        if (!uri) throw new Error("MONGO_URI is missing");
        const conn = await mongoose.connect(uri);
        log.info(`DB CONNECTED ON HOST: ${conn.connection.host}`);
        return conn;
    }

    async disconnect() {
        await mongoose.disconnect();
    }

    async startSession() {
        return mongoose.startSession();
    }

    async create(Model, data, options = {}) {
        const { session } = options;
        if (Array.isArray(data)) {
            return Model.create(data, session ? { session } : undefined);
        }
        if (session) {
            const arr = await Model.create([data], { session });
            return arr[0];
        }
        return Model.create(data);
    }

    async findById(Model, id, options = {}) {
        return applyOpts(Model.findById(id), options).exec();
    }

    async findOne(Model, filter, options = {}) {
        return applyOpts(Model.findOne(filter), options).exec();
    }

    async find(Model, filter = {}, options = {}) {
        return applyOpts(Model.find(filter), options).exec();
    }

    async updateById(Model, id, data, options = {}) {
        const { populate, new: ret = true, runValidators = true } = options;
        let q = Model.findByIdAndUpdate(id, data, { new: ret, runValidators });
        if (populate) q = q.populate(populate);
        return q.exec();
    }

    async updateOne(Model, filter, data, options = {}) {
        const { populate, new: ret = true, runValidators = true } = options;
        let q = Model.findOneAndUpdate(filter, data, { new: ret, runValidators });
        if (populate) q = q.populate(populate);
        return q.exec();
    }

    async deleteById(Model, id) {
        return Model.findByIdAndDelete(id);
    }

    async count(Model, filter = {}) {
        return Model.countDocuments(filter);
    }

    async exists(Model, filter) {
        return Model.exists(filter);
    }

    async aggregate(Model, pipeline) {
        return Model.aggregate(pipeline);
    }

    raw() {
        return mongoose;
    }
}
