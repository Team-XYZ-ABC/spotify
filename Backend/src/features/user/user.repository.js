import BaseRepository from "../../core/database/base.repository.js";
import UserModel from "./user.model.js";

class UserRepository extends BaseRepository {
    constructor() {
        super(UserModel);
    }

    findByEmail(email, options) {
        return this.findOne({ email: String(email).toLowerCase().trim() }, options);
    }

    findByEmailOrUsername(identifier, options) {
        return this.findOne(
            { $or: [{ email: identifier }, { username: identifier }] },
            options
        );
    }

    emailExists(email) {
        return this.exists({ email: String(email).toLowerCase().trim() });
    }
}

export default new UserRepository();
