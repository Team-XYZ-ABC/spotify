export const getPlaylistCoverImages = (playlist, limit = 4) =>
    (playlist?.tracks || [])
        .map((track) => track.image)
        .filter(Boolean)
        .slice(0, limit);

export const formatTrackCount = (count) => `${count} song${count === 1 ? "" : "s"}`;

const toSeconds = (duration) => {
    if (typeof duration === "number" && Number.isFinite(duration)) {
        return duration;
    }

    if (typeof duration !== "string") {
        return 0;
    }

    const parts = duration.split(":").map(Number);

    if (parts.length === 2) {
        return (parts[0] * 60) + parts[1];
    }

    if (parts.length === 3) {
        return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }

    return 0;
};

export const formatPlaylistDuration = (tracks) => {
    const totalSeconds = (tracks || []).reduce((sum, track) => sum + toSeconds(track.duration), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours} hr ${minutes} min`;
    }

    if (minutes > 0 && seconds > 0) {
        return `${minutes} min ${seconds} sec`;
    }

    if (minutes > 0) {
        return `${minutes} min`;
    }

    return `${seconds} sec`;
};

export const formatAddedLabel = (addedAt) => {
    const diffMinutes = Math.max(
        1,
        Math.round((Date.now() - new Date(addedAt).getTime()) / (1000 * 60))
    );

    if (diffMinutes < 60) {
        return `${diffMinutes} min ago`;
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }

    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }

    return new Date(addedAt).toLocaleDateString();
};