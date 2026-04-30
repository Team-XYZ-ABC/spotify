import TrackModel from "../track/track.model.js";
import ArtistModel from "../artist/artist.model.js";
import albumModel from "../album/album.model.js";
import logger from "../../core/logger/logger.js";
import { signObjectUrl } from "../../utils/media-url.util.js";

const log = logger.child("search");

/**
 * Atlas Search aggregation helpers — kept on the repository because they are
 * intrinsically MongoDB-specific. A different DB driver would require a
 * different repository implementation here (full-text in Postgres, etc.).
 */

const trackSearchPipeline = (q, limit = 10) => [
    {
        $search: {
            index: "default",
            autocomplete: { query: q, path: "title", fuzzy: { maxEdits: 1 } },
        },
    },
    { $limit: limit },
];

const artistSearchPipeline = (q, limit = 5) => [
    {
        $search: {
            index: "default",
            autocomplete: { query: q, path: "stageName", fuzzy: { maxEdits: 1 } },
        },
    },
    { $limit: limit },
    {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
        },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
];

const albumSearchPipeline = (q, limit = 5) => [
    {
        $search: {
            index: "default",
            autocomplete: { query: q, path: "title", fuzzy: { maxEdits: 1 } },
        },
    },
    { $limit: limit },
];

class SearchRepository {
    searchTracks(q) {
        return TrackModel.aggregate(trackSearchPipeline(q));
    }
    searchArtists(q) {
        return ArtistModel.aggregate(artistSearchPipeline(q));
    }
    searchAlbums(q) {
        return albumModel.aggregate(albumSearchPipeline(q));
    }

    async searchAllSafe(q) {
        return Promise.all([
            this.searchTracks(q).catch((err) => {
                log.warn("Track search error", { msg: err.message });
                return [];
            }),
            this.searchArtists(q).catch((err) => {
                log.warn("Artist search error", { msg: err.message });
                return [];
            }),
            this.searchAlbums(q).catch((err) => {
                log.warn("Album search error", { msg: err.message });
                return [];
            }),
        ]);
    }
}

export const searchRepository = new SearchRepository();

/**
 * Sign cover/avatar fields on a search result row.
 */
export const signSearchItem = async (item) => {
    const cloned = { ...item };
    cloned.coverImage = await signObjectUrl(
        cloned.coverImageKey,
        cloned.coverImage || ""
    );
    if (cloned.user && typeof cloned.user === "object") {
        cloned.user = { ...cloned.user };
        cloned.user.avatar = await signObjectUrl(
            cloned.user.avatarKey,
            cloned.user.avatar || ""
        );
    }
    return cloned;
};
