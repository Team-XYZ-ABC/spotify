import { z } from "zod";

export const presignedUrlSchema = z.object({
    fileName: z.string().trim().min(1, "File name is required"),
    contentType: z.string().trim().min(1, "Content type is required"),
    folder: z.enum(["audio", "covers", "avatars", "profiles"], {
        errorMap: () => ({
            message: "Folder must be audio, covers, avatars or profiles",
        }),
    }),
});
