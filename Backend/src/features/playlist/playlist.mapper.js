import { signObjectUrl } from "../../utils/media-url.util.js";
import { formatDuration } from "../../utils/pagination.util.js";

const mapUser = async (userDoc) => {
    if (!userDoc) return null;
    return {
        id: userDoc?._id ? String(userDoc._id) : null,
        username: userDoc?.username,
        email: userDoc?.email,
        displayName: userDoc?.displayName,
        avatar: await signObjectUrl(userDoc?.avatarKey, userDoc?.avatar),
    };
};

const mapPlaylistTrack = async (playlistTrack) => {
    const trackDoc = playlistTrack?.track;
    if (!trackDoc || typeof trackDoc !== "object") return null;

    const mainArtist = trackDoc.primaryArtist?.stageName || "Unknown artist";
    const featuredArtists = Array.isArray(trackDoc.artists)
        ? trackDoc.artists
            .map((artist) => {
                if (typeof artist === "string") return artist.trim();
                if (artist && typeof artist === "object") return artist.stageName?.trim();
                return "";
            })
            .filter(Boolean)
            .filter((name) => name !== mainArtist)
        : [];

    return {
        id: String(trackDoc._id),
        title: trackDoc.title,
        artist: [mainArtist, ...featuredArtists].join(", "),
        album: trackDoc.album?.title || "Single",
        duration: formatDuration(trackDoc.duration),
        durationSeconds: trackDoc.duration,
        image: await signObjectUrl(trackDoc.coverImageKey, trackDoc.coverImage),
        addedAt: playlistTrack.addedAt,
        addedBy: playlistTrack.addedBy,
    };
};

export const mapPlaylist = async (playlistDoc, currentUserId) => {
    const tracks = (
        await Promise.all((playlistDoc.tracks || []).map(mapPlaylistTrack))
    ).filter(Boolean);

    const totalDurationSeconds = tracks.reduce(
        (sum, track) => sum + (track.durationSeconds || 0),
        0
    );

    const ownerId = String(playlistDoc.owner?._id || playlistDoc.owner);
    const collaboratorIds = new Set(
        (playlistDoc.collaborators || []).map((u) => String(u?._id || u))
    );

    return {
        id: playlistDoc._id,
        name: playlistDoc.name,
        description: playlistDoc.description,
        coverImage: playlistDoc.coverImage,
        isPublic: playlistDoc.isPublic,
        owner: await mapUser(playlistDoc.owner),
        collaborators: await Promise.all((playlistDoc.collaborators || []).map(mapUser)),
        songCount: tracks.length,
        totalDurationSeconds,
        tracks,
        permissions: {
            isOwner: ownerId === String(currentUserId),
            isCollaborator: collaboratorIds.has(String(currentUserId)),
        },
        createdAt: playlistDoc.createdAt,
        updatedAt: playlistDoc.updatedAt,
    };
};

export const mapTrackForPicker = async (track) => ({
    id: track._id,
    title: track.title,
    duration: formatDuration(track.duration),
    durationSeconds: track.duration,
    image: await signObjectUrl(track.coverImageKey, track.coverImage),
    album: track.album?.title || "Single",
    artist:
        track.primaryArtist?.stageName ||
        track.artists?.[0]?.stageName ||
        "Unknown artist",
});

export const mapCollaboratorUser = async (user) => ({
    id: String(user._id),
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatar: await signObjectUrl(user.avatarKey, user.avatar),
});
