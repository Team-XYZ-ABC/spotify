import BaseRepository from "../../core/database/base.repository.js";
import TrackModel from "./track.model.js";

class TrackRepository extends BaseRepository {
    constructor() {
        super(TrackModel);
    }

    findWithArtistAndAlbum(trackId) {
        return this.findById(trackId, {
            populate: [
                { path: "artists", select: "name" },
                { path: "album", select: "title" },
            ],
        });
    }

    findByArtist(primaryArtist, options = {}) {
        return this.find(
            { primaryArtist },
            {
                sort: { createdAt: -1 },
                select:
                    "title artists album genres lang isExplicit copyrightOwner isrc availableCountries duration coverImage coverImageKey createdAt updatedAt",
                lean: true,
                ...options,
            }
        );
    }

    searchByTitle(query, limit = 20) {
        const filter = query ? { title: new RegExp(query, "i") } : {};
        return TrackModel.find(filter)
            .select("title duration coverImage coverImageKey primaryArtist artists album")
            .populate("primaryArtist", "stageName")
            .populate("artists", "stageName")
            .populate("album", "title")
            .limit(limit)
            .exec();
    }
}

export default new TrackRepository();
