import BaseRepository from "../../core/database/base.repository.js";
import ArtistModel from "./artist.model.js";

class ArtistRepository extends BaseRepository {
    constructor() {
        super(ArtistModel);
    }

    findByUser(userId, options) {
        return this.findOne({ user: userId }, options);
    }
}

export default new ArtistRepository();
