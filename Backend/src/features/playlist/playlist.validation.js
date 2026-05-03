import { z } from "zod";

const mongoId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");
const trimmedString = (min, max) =>
    z.string().trim().min(min, `Must be at least ${min} character(s)`).max(max, `Must be at most ${max} characters`);

export const createPlaylistSchema = z.object({
    name: trimmedString(1, 120),
    description: z.string().trim().max(500).optional().default(""),
    coverImage: z
        .string()
        .trim()
        .url("Cover image must be a valid URL")
        .optional()
        .or(z.literal("")),
    isPublic: z.boolean().optional().default(true),
});

export const updatePlaylistSchema = z
    .object({
        name: trimmedString(1, 120).optional(),
        description: z.string().trim().max(500).optional(),
        coverImage: z
            .string()
            .trim()
            .url("Cover image must be a valid URL")
            .optional()
            .or(z.literal("")),
        isPublic: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field required",
    });

export const addTrackSchema = z.object({ trackId: mongoId });
export const removeTrackSchema = z.object({ trackId: mongoId });

export const reorderTracksSchema = z.object({
    sourceIndex: z.number().int().min(0),
    destinationIndex: z.number().int().min(0),
});

export const addCollaboratorsSchema = z.object({
    collaboratorIds: z.array(mongoId).min(1, "At least one collaborator required"),
});
