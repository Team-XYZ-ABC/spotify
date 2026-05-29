import TrackModel from "../track/track.model.js";
import ArtistModel from "../artist/artist.model.js";
import AlbumModel from "../album/album.model.js";
import { signObjectUrl } from "../../utils/media-url.util.js";

const trackPipeline = (q, limit = 10) => [
    {
        $search: {
            index: "default",
            autocomplete: { query: q, path: "title", fuzzy: { maxEdits: 1 } },
        },
    },
    { $limit: limit },
];

const artistPipeline = (q, limit = 5) => [
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

const albumPipeline = (q, limit = 5) => [
    {
        $search: {
            index: "default",
            autocomplete: { query: q, path: "title", fuzzy: { maxEdits: 1 } },
        },
    },
    { $limit: limit },
];

export const searchTracks = async (q) => {
    try {
        return await TrackModel.aggregate(trackPipeline(q));
    } catch (err) {
        console.warn("[search] Atlas search failed for tracks, falling back to regex:", err.message);
        return await TrackModel.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { genres: { $regex: q, $options: "i" } },
                { artists: { $regex: q, $options: "i" } }
            ],
            isPublished: true
        }).limit(10).lean();
    }
};

export const searchArtists = async (q) => {
    try {
        return await ArtistModel.aggregate(artistPipeline(q));
    } catch (err) {
        console.warn("[search] Atlas search failed for artists, falling back to regex:", err.message);
        return await ArtistModel.find({
            $or: [
                { stageName: { $regex: q, $options: "i" } },
                { genres: { $regex: q, $options: "i" } }
            ],
            isActive: true
        })
        .populate({ path: "user" })
        .limit(5)
        .lean();
    }
};

export const searchAlbums = async (q) => {
    try {
        return await AlbumModel.aggregate(albumPipeline(q));
    } catch (err) {
        console.warn("[search] Atlas search failed for albums, falling back to regex:", err.message);
        return await AlbumModel.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { genres: { $regex: q, $options: "i" } }
            ],
            isPublic: true,
            isDeleted: false
        }).limit(5).lean();
    }
};

export const searchAllSafe = (q) =>
    Promise.all([
        searchTracks(q).catch((err) => {
            console.warn("[search] tracks safe-catch:", err.message);
            return [];
        }),
        searchArtists(q).catch((err) => {
            console.warn("[search] artists safe-catch:", err.message);
            return [];
        }),
        searchAlbums(q).catch((err) => {
            console.warn("[search] albums safe-catch:", err.message);
            return [];
        }),
    ]);

export const signSearchItem = async (item) => {
    const out = { ...item };
    out.coverImage = await signObjectUrl(out.coverImageKey, out.coverImage || "");
    if (out.user && typeof out.user === "object") {
        out.user = { ...out.user };
        out.user.avatar = await signObjectUrl(
            out.user.avatarKey,
            out.user.avatar || ""
        );
    }
    return out;
};
