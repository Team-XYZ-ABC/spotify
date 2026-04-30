import { z } from "zod";

export const uploadUrlSchema = z.object({
    fileName: z.string().min(1),
    contentType: z.string().min(1),
});

export const confirmUploadSchema = z.object({
    audioKey: z.string().min(1, "audioKey is required"),
    title: z.string().trim().min(1).max(200),
    artists: z.array(z.string().trim().min(1)).min(1),
    album: z.string().trim().optional(),
    genres: z.array(z.string().trim()).optional().default([]),
    lang: z.string().trim().optional(),
    coverImageKey: z.string().optional(),
    duration: z.number().min(0).optional(),
    isExplicit: z.boolean().optional().default(false),
    copyrightOwner: z.string().trim().optional(),
    isrc: z.string().trim().optional(),
    availableCountries: z.array(z.string()).optional().default([]),
});
