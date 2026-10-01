import { Color } from "@prisma/client";
import { z } from "zod";

const photoFieldsSchema = z.object({
  place: z.string().min(1).max(191),
  month: z.string().min(1).max(191),
  year: z.string().min(1).max(191),
  color: z.nativeEnum(Color),
  shotAt: z.string().datetime().optional(),
});

const cloudinaryImageUrlSchema = z
  .string()
  .url()
  .max(2048)
  .refine(
    (value) => {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        url.hostname === "res.cloudinary.com" &&
        /^\/[^/]+\/image\/upload(?:\/|$)/.test(url.pathname)
      );
    },
    { message: "Must be a secure Cloudinary image URL" }
  );

const cloudinaryPublicIdSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(
    /^[A-Za-z0-9_./-]+$/,
    "Must be a valid Cloudinary public identifier"
  );

export const photoFormSchema = photoFieldsSchema;

export const createPhotoSchema = photoFieldsSchema.extend({
  photoUrl: cloudinaryImageUrlSchema,
  publicId: cloudinaryPublicIdSchema,
  isPortrait: z.boolean().nullable(),
});
