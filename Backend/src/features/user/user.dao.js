import UserModel from "./user.model.js";

export const findById = (id, opts = {}) => {
    let q = UserModel.findById(id);
    if (opts.select) q = q.select(opts.select);
    if (opts.lean) q = q.lean();
    return q.exec();
};

export const findOne = (filter, opts = {}) => {
    let q = UserModel.findOne(filter);
    if (opts.select) q = q.select(opts.select);
    if (opts.lean) q = q.lean();
    return q.exec();
};

export const create = (data, opts = {}) => {
    if (opts.session) {
        return UserModel.create([data], { session: opts.session }).then((arr) => arr[0]);
    }
    return UserModel.create(data);
};

export const count = (filter) => UserModel.countDocuments(filter);

export const emailExists = (email) =>
    UserModel.exists({ email: String(email).toLowerCase().trim() });
