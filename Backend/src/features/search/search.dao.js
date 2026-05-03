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

export const searchTracks = (q) => TrackModel.aggregate(trackPipeline(q));
export const searchArtists = (q) => ArtistModel.aggregate(artistPipeline(q));
export const searchAlbums = (q) => AlbumModel.aggregate(albumPipeline(q));

export const searchAllSafe = (q) =>
    Promise.all([
        searchTracks(q).catch((err) => {
            console.warn("[search] tracks error:", err.message);
            return [];
        }),
        searchArtists(q).catch((err) => {
            console.warn("[search] artists error:", err.message);
            return [];
        }),
        searchAlbums(q).catch((err) => {
            console.warn("[search] albums error:", err.message);
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
