import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
  voiceCategories,
} from "./constants";

// NOTE: `File` is a browser type; this schema is intended for client-side validation.
// Zod's `instanceof` check will work in the browser environment.

export const UploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => ACCEPTED_PDF_TYPES.includes(file.type), {
      message: "Please upload a valid PDF file.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "PDF must be less than 50MB.",
    }),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Cover image must be JPG/PNG/WebP.",
    })
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
      message: "Cover image must be less than 10MB.",
    }),
  title: z.string().min(1, "Title is required."),
  author: z.string().min(1, "Author name is required."),
  voice: z.enum([
    ...voiceCategories.male,
    ...voiceCategories.female,
  ] as const),
});

export type UploadSchemaType = z.infer<typeof UploadSchema>;
