import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
    displayName: z.string().trim().min(1, "Display name is required").max(50, "Max 50 characters"),
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Max 30 characters")
        .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["listener", "artist"]).default("listener"),
});

export const emailSchema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
});

// ─── Playlist ─────────────────────────────────────────────────────────────────
export const createPlaylistSchema = z.object({
    name: z.string().trim().min(1, "Playlist name is required").max(120, "Max 120 characters"),
    description: z.string().trim().max(500, "Max 500 characters").optional(),
    coverImage: z
        .string()
        .trim()
        .refine(
            (v) => v === "" || z.string().url().safeParse(v).success,
            "Cover image must be a valid URL"
        )
        .optional(),
});

export const updatePlaylistSchema = createPlaylistSchema.partial();

/**
 * Validate data against a Zod schema and return { values, errors }.
 * `errors` is a Record<field, message> or null when valid.
 */
export const validate = (schema, data) => {
    const result = schema.safeParse(data);
    if (result.success) return { values: result.data, errors: null };

    const errors = {};
    for (const issue of result.error.errors) {
        const key = issue.path.join(".");
        if (!errors[key]) errors[key] = issue.message;
    }
    return { values: null, errors };
};
