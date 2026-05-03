import { z } from "zod";

// ─── Reusable field schemas ───────────────────────────────────────────────────
const mongoId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");
const trimmedString = (min, max) =>
    z.string().trim().min(min, `Must be at least ${min} character(s)`).max(max, `Must be at most ${max} characters`);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
    displayName: trimmedString(1, 50),
    username: trimmedString(3, 30).regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers and underscores"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["listener", "artist"]).optional().default("listener"),
});

export const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const emailExistsSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
});

// ─── Playlist ─────────────────────────────────────────────────────────────────
export const createPlaylistSchema = z.object({
    name: trimmedString(1, 120),
    description: z.string().trim().max(500).optional().default(""),
    coverImage: z.string().trim().url("Cover image must be a valid URL").optional().or(z.literal("")),
    isPublic: z.boolean().optional().default(true),
});

export const updatePlaylistSchema = z.object({
    name: trimmedString(1, 120).optional(),
    description: z.string().trim().max(500).optional(),
    coverImage: z.string().trim().url("Cover image must be a valid URL").optional().or(z.literal("")),
    isPublic: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field required" });

export const addTrackSchema = z.object({
    trackId: mongoId,
});

export const removeTrackSchema = z.object({
    trackId: mongoId,
});

export const reorderTracksSchema = z.object({
    sourceIndex: z.number().int().min(0),
    destinationIndex: z.number().int().min(0),
});

export const addCollaboratorsSchema = z.object({
    collaboratorIds: z.array(mongoId).min(1, "At least one collaborator required"),
});

// ─── Track ────────────────────────────────────────────────────────────────────
export const uploadTrackSchema = z.object({
    title: trimmedString(1, 200),
    artists: z.array(z.string().trim().min(1)).min(1, "At least one artist required"),
    album: z.string().trim().optional(),
    genres: z.array(z.string().trim()).min(1, "At least one genre required"),
    lang: z.string().trim().min(1, "Language is required"),
    audioKey: z.string().min(1, "Audio file key is required"),
    coverImageKey: z.string().optional(),
    availableCountries: z.array(z.string()).optional().default([]),
    duration: z.number().min(0).optional(),
    isExplicit: z.boolean().optional().default(false),
    copyrightOwner: z.string().trim().optional(),
    isrc: z.string().trim().optional(),
});

export const updateTrackSchema = z.object({
    title: trimmedString(1, 200).optional(),
    artists: z.array(z.string().trim().min(1)).optional(),
    genres: z.array(z.string().trim()).optional(),
    lang: z.string().trim().optional(),
    isExplicit: z.boolean().optional(),
    copyrightOwner: z.string().trim().optional(),
    coverImageKey: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field required" });

// ─── S3 presigned URL ─────────────────────────────────────────────────────────
export const presignedUrlSchema = z.object({
    fileName: z.string().trim().min(1, "File name is required"),
    contentType: z.string().trim().min(1, "Content type is required"),
    folder: z.enum(["audio", "covers", "avatars", "profiles"], { errorMap: () => ({ message: "Folder must be audio, covers, avatars or profiles" }) }),
});
