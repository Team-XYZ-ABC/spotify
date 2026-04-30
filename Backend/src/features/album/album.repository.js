import BaseRepository from "../../core/database/base.repository.js";
import AlbumModel from "./album.model.js";

class AlbumRepository extends BaseRepository {
    constructor() {
        super(AlbumModel);
    }
}

export default new AlbumRepository();
