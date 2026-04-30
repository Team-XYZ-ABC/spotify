import { z } from "zod";

const trimmedString = (min, max) =>
    z.string().trim().min(min, `Must be at least ${min} character(s)`).max(max, `Must be at most ${max} characters`);

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

export const updateTrackSchema = z
    .object({
        title: trimmedString(1, 200).optional(),
        artists: z.array(z.string().trim().min(1)).optional(),
        genres: z.array(z.string().trim()).optional(),
        lang: z.string().trim().optional(),
        isExplicit: z.boolean().optional(),
        copyrightOwner: z.string().trim().optional(),
        coverImageKey: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field required",
    });
