import { z } from "zod";

const trimmedString = (min, max) =>
    z.string().trim().min(min, `Must be at least ${min} character(s)`).max(max, `Must be at most ${max} characters`);

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
