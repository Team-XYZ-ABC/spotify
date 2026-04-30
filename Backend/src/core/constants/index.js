/**
 * Application-wide constants.
 * Avoid magic numbers/strings scattered across the codebase.
 */

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    INTERNAL: 500,
    NOT_IMPLEMENTED: 501,
};

export const ROLES = {
    LISTENER: "listener",
    ARTIST: "artist",
    ADMIN: "admin",
};

export const ERROR_CODES = {
    VALIDATION: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    CONFLICT: "CONFLICT",
    INTERNAL: "INTERNAL_ERROR",
    NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
};

export const PLAYLIST_LIMITS = {
    MAX_COLLABORATORS: 10,
    MAX_TRACKS: 100,
};

export const STORAGE_FOLDERS = {
    AUDIO: "audio",
    COVERS: "covers",
    AVATARS: "avatars",
    PROFILES: "profiles",
};

export const URL_TTL = {
    ONE_HOUR: 60 * 60,
    ONE_DAY: 24 * 60 * 60,
    FIVE_MINUTES: 5 * 60,
};
